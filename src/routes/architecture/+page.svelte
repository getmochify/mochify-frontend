<script lang="ts">
    import ProseDocument from '$lib/components/ProseDocument.svelte';
</script>

<svelte:head>
    <title>Architecture &amp; Data Handling — Mochify</title>
    <meta name="description" content="How Mochify processes images: an in-memory pipeline on a read-only container, with no image data ever written to disk. The configuration behind the zero-retention claim.">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/architecture">
    <meta property="og:title" content="Architecture &amp; Data Handling — Mochify">
    <meta property="og:description" content="How Mochify processes images: an in-memory pipeline on a read-only container, with no image data ever written to disk.">
</svelte:head>

<ProseDocument title="Architecture &amp; data handling" eyebrow="Transparency">
    <p>
        Most image tools ask you to take "we don't keep your files" on trust. This page explains
        how Mochify is built so you can check the claim against the design rather than the promise.
    </p>

    <h2>The short version</h2>
    <p>
        Your image arrives over HTTPS, is decoded in memory, processed, encoded, and returned in the
        same request. The bytes exist as a buffer in RAM for the duration of that request and are
        freed when it ends. They are never written to a disk, never placed in a queue, never copied
        to object storage, and never used to train anything.
    </p>

    <h2>Why there is nothing to delete</h2>
    <p>
        The strongest privacy guarantee is not a deletion policy, it is an architecture with no
        storage step to delete from. Mochify has no upload directory, no processing queue backed by
        files, and no bucket of originals awaiting cleanup. There is no retention window because
        there is no retention.
    </p>
    <p>
        This is a deliberate constraint rather than a happy accident, and it costs us things.
        Resumable uploads have to hold their partial data in memory instead of on disk. We cannot
        offer "recover my last export" or a processing history. Those are reasonable features that
        we have given up in order to make the guarantee structural.
    </p>

    <h2>The processing container cannot write to disk</h2>
    <p>
        The image pipeline runs as a container with its root filesystem mounted read-only. This
        matters because it changes the nature of the claim: it is not that our code declines to
        write files, it is that a write would fail at the kernel level. A bug, a misconfiguration,
        or a dependency deciding to cache something to disk cannot quietly turn into stored user
        data, because there is nowhere for it to go.
    </p>
    <ul>
        <li><strong>Read-only root filesystem:</strong> the container has no writable path to persist anything to.</li>
        <li><strong>Scratch space is RAM:</strong> <code>/tmp</code> is a memory-backed filesystem capped at 1GB, and the image library is pointed at it. Anything temporary lives in RAM and disappears with the container.</li>
        <li><strong>One host path is mounted, read-only:</strong> a configuration file. There is no writable path to the host at all, which is what the zero write counter above reflects.</li>
        <li><strong>Application logs to stdout:</strong> the service writes no log files of its own.</li>
    </ul>

    <p>
        These are properties of the container as it runs, not intentions. The relevant fields from
        the daemon's own configuration for it:
    </p>

    <div class="not-prose my-6 overflow-x-auto rounded-2xl bg-[#282C34] p-5 shadow-sm">
        <pre class="text-[12px] leading-relaxed text-[#E6E6E6] font-mono whitespace-pre">$ docker inspect mochify-core

<span class="text-[#9AA0A6]">"HostConfig": &#123;</span>
    "ReadonlyRootfs": <span class="text-[#A5D6A7] font-bold">true</span>,
    "Tmpfs": &#123; "/tmp": "size=1024M,mode=1777" &#125;,
    "CapDrop": [ <span class="text-[#A5D6A7] font-bold">"ALL"</span> ],
    "CapAdd": <span class="text-[#A5D6A7] font-bold">null</span>,
    "SecurityOpt": [ "no-new-privileges:true" ],
    "Privileged": <span class="text-[#A5D6A7] font-bold">false</span>
<span class="text-[#9AA0A6]">&#125;,
"Mounts": [</span>
    &#123; "Destination": "/app/config.json", "RW": <span class="text-[#A5D6A7] font-bold">false</span> &#125;
<span class="text-[#9AA0A6]">]</span></pre>
    </div>

    <p>
        This is an excerpt covering data handling rather than the full output, which also contains
        network and host details we do not publish.
    </p>

    <h2>What happens if the image decoder is exploited</h2>
    <p>
        Decoding untrusted images is the riskiest thing this service does. Image formats are
        complicated, decoders are written in C, and vulnerabilities in them are a recurring fact of
        life across the whole industry. Rather than assume ours will never have one, the container
        is built so that a decoder compromise stays contained.
    </p>
    <ul>
        <li><strong>Every Linux capability is dropped.</strong> The process holds none of the privileges that turn code execution into host access: it cannot mount filesystems, load kernel modules, alter network configuration, or trace other processes.</li>
        <li><strong>Privileges cannot be regained.</strong> <code>no-new-privileges</code> means no path through a setuid binary can escalate back out.</li>
        <li><strong>There is nowhere to persist a payload.</strong> The read-only filesystem applies to an attacker exactly as it applies to us.</li>
        <li><strong>The service is not reachable directly.</strong> It listens only on the host's loopback interface, behind a reverse proxy.</li>
    </ul>
    <p>
        None of this makes an exploit impossible. It means the blast radius of one is a single
        container with no privileges, no writable storage, and nothing but the image currently in
        memory.
    </p>

    <p>
        Here is the live container as reported by the Docker daemon on 5 August 2026:
    </p>

    <div class="not-prose my-6 overflow-x-auto rounded-2xl bg-[#282C34] p-5 shadow-sm">
        <pre class="text-[12px] leading-relaxed text-[#E6E6E6] font-mono whitespace-pre"><span class="text-[#9AA0A6]">CONTAINER ID   NAME            CPU %    MEM USAGE / LIMIT    MEM %    NET I/O            BLOCK I/O      PIDS</span>
06b59c402968   mochify-core    3.94%    480.6MiB / 15.62GiB  3.00%    14.8kB / 8.22kB    304MB / <span class="text-[#A5D6A7] font-bold">0B</span>     22</pre>
    </div>

    <p>
        The figure that matters is the second half of <strong>BLOCK I/O</strong>: <strong>0B
        written</strong>. The first half, 304MB read, is the container loading its own program into
        memory when it started, the binary and the shared libraries it links against. Reads are
        expected and unavoidable. Writes are the number that would betray stored user data, and it
        is zero.
    </p>
    <p>
        We would rather show you the whole line than a curated subset, including the read figure
        that needs explaining. But treat it as an illustration rather than an audit: this output is
        rendered by us, on our own website, and you have no way to confirm we did not simply type
        it. The read-only filesystem above is the real guarantee, because it holds whether or not
        you believe this screenshot. The counter merely agrees with it.
    </p>

    <h2>Large and resumable uploads</h2>
    <p>
        Files above roughly 5MB are uploaded in chunks so that a dropped connection can resume
        instead of starting over. This is the one place where a naive implementation would reach for
        temporary files on disk, and it is worth being specific about how we avoid it.
    </p>
    <p>
        Each upload session holds its chunks in a contiguous memory buffer, keyed by a session
        identifier bound to the caller. Chunks are reassembled in RAM, processed, and the session is
        destroyed. An abandoned upload expires and its buffer is freed. Nothing about the resumable
        path touches a filesystem.
    </p>

    <h2>Bring your own bucket</h2>
    <p>
        Paid plans can have results written directly to storage you own, such as Amazon S3 or
        Cloudflare R2. Two details are worth stating plainly, because this is the one feature where
        Mochify holds a credential on your behalf.
    </p>
    <ul>
        <li>
            <strong>Your keys are encrypted and isolated.</strong> The secret is sealed with
            AES-256-GCM under a key held by a single service. The dashboard cannot decrypt it, and
            the image pipeline never sees it at all.
        </li>
        <li>
            <strong>The pipeline receives a capability, not a credential.</strong> When a result is
            written to your bucket, the processing service is handed a pre-signed URL valid for one
            object and a few minutes. It cannot choose the destination, list your bucket, or read
            anything from it.
        </li>
    </ul>
    <p>
        The result travels from the processing container straight to your storage. It does not pass
        back through your browser and it is not staged anywhere in between.
    </p>

    <h2>What we do record</h2>
    <p>
        Being credible about what we do not store means being honest about what we do. None of it
        is image content.
    </p>
    <ul>
        <li><strong>Operational logs:</strong> request-level metadata such as timing, status codes, and errors, used to keep the service running and diagnose faults.</li>
        <li><strong>Usage counters:</strong> how many operations your account has performed in the current period, so quotas can be enforced.</li>
        <li><strong>Account data:</strong> your email address and subscription state.</li>
        <li><strong>Product analytics:</strong> which features get used and where errors happen, processed by PostHog as a third-party processor. Requests are routed through our own domain so the data is not lost to content blockers, but PostHog is the processor and we are not going to pretend otherwise. Signed-in accounts are identified by email address so a reported fault can be connected to the person reporting it. There are no advertising identifiers and no cross-site tracking.</li>
    </ul>
    <p>
        Full detail, including retention periods and your rights over this data, is in the
        <a href="/privacy">privacy policy</a> and the <a href="/dpa">data processing agreement</a>.
    </p>

    <h2>What you can verify yourself</h2>
    <p>
        You do not have to take any of the above on faith. A few things are checkable from your own
        browser:
    </p>
    <ul>
        <li>Open your browser's network inspector during a compression and watch the response come back in the same request that sent the image. There is no second fetch from a storage host.</li>
        <li>Check the response headers. Processing time is reported on each response, and the API sets no tracking cookies.</li>
        <li>Read the content security policy this site sends. It restricts where the page is allowed to send data at all.</li>
    </ul>
    <p>
        If you need a stronger assurance than this for a procurement or compliance process, get in
        touch at <a href="mailto:hello@mochify.app">hello@mochify.app</a> and we will work through
        your specific requirements.
    </p>

    <hr />

    <p>
        <em>
            If anything on this page turns out to be inaccurate, we would rather hear about it than
            not. Corrections to <a href="mailto:hello@mochify.app">hello@mochify.app</a>.
        </em>
    </p>
</ProseDocument>
