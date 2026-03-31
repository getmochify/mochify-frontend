<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
</script>

<svelte:head>
    <title>Data Processing Agreement | Mochify</title>
    <meta name="description" content="Mochify's Data Processing Agreement (DPA) for business customers. GDPR-compliant, UK law governed. Download the template or request a countersigned copy.">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/dpa">
    <meta property="og:title" content="Data Processing Agreement | Mochify">
    <meta property="og:description" content="Mochify's Data Processing Agreement (DPA) for business customers. GDPR-compliant, UK law governed. Download the template or request a countersigned copy.">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">

    <div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjgiIGZpbGw9InJnYmEoMjU1LDI0MCwyNDMsMC4zKSIvPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

    <Navigation />
    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <header class="text-center mb-16">
            <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FFB3C6] via-[#E0ACD5] to-[#C5A3E0] bg-clip-text text-transparent leading-tight text-center drop-shadow-sm pb-2 mb-16">
                Data Processing Agreement
            </h1>
        </header>

        <div class="max-w-4xl mx-auto space-y-8">

            <!-- Intro card -->
            <div class="bg-white rounded-3xl border border-pink-50 shadow-sm p-8 md:p-12">
                <p class="text-[#6C3F31] text-lg leading-relaxed mb-6">
                    At Mochify, data privacy isn't an afterthought — it's built into how our service works. All image files are processed entirely in-memory and never written to disk, meaning there is nothing to retain, breach, or leak.
                </p>
                <p class="text-[#6C3F31] text-lg leading-relaxed mb-8">
                    For businesses that require a formal Data Processing Agreement (DPA) as part of their GDPR compliance obligations, we have prepared the following template in accordance with UK GDPR and Article 28 requirements.
                </p>

                <h2 class="text-2xl font-black text-[#4A2C2C] mb-4">How this works</h2>
                <ul class="space-y-3 mb-8">
                    <li class="flex gap-3 text-[#6C3F31]">
                        <span class="text-[#F06292] font-bold mt-0.5">•</span>
                        <span>This document sets out the terms under which Mochify (as <strong class="text-[#4A2C2C]">Data Processor</strong>) processes image data on behalf of your business (as <strong class="text-[#4A2C2C]">Data Controller</strong>)</span>
                    </li>
                    <li class="flex gap-3 text-[#6C3F31]">
                        <span class="text-[#F06292] font-bold mt-0.5">•</span>
                        <span>To enter into this agreement, download the PDF, complete your company details in the Customer section, sign it, and return a countersigned copy to us at <strong class="text-[#4A2C2C]">legal@mochify.app</strong></span>
                    </li>
                    <li class="flex gap-3 text-[#6C3F31]">
                        <span class="text-[#F06292] font-bold mt-0.5">•</span>
                        <span>We will countersign and return a copy for your records within 5 working days</span>
                    </li>
                </ul>

                <a
                    href="/dpa/mochify-dpa.pdf"
                    download
                    class="inline-flex items-center gap-2 bg-[#A5D6A7] hover:bg-[#81C784] text-[#2E7D32] font-bold px-6 py-3 rounded-2xl transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download DPA (PDF)
                </a>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-4">
                <hr class="flex-1 border-none h-px bg-gradient-to-r from-transparent via-[#FFE5EC] to-transparent" />
                <span class="text-[#D4A0B5] text-sm font-medium">Full agreement text</span>
                <hr class="flex-1 border-none h-px bg-gradient-to-r from-transparent via-[#FFE5EC] to-transparent" />
            </div>

            <!-- Full DPA text -->
            <article class="prose max-w-none bg-white p-8 md:p-12 rounded-3xl border border-pink-50 shadow-sm prose-li:my-4">

                <p><em>The full text of the agreement is reproduced below for your reference.</em></p>

                <h3>Data Processing Agreement</h3>

                <p>This Data Processing Agreement (<strong>"Agreement"</strong>) is entered into between:</p>

                <ul>
                    <li><strong>Data Controller:</strong> The customer entity identified in the order form or account registration (<strong>"Customer"</strong>); and</li>
                    <li><strong>Data Processor:</strong> Mochify, of Suite RA01, 195-197 Wood Street, London, E17 3NU (<strong>"Mochify"</strong>).</li>
                </ul>

                <p>This Agreement forms part of and is subject to the Terms and Conditions between the parties and applies where Mochify processes Personal Data on behalf of the Customer in the course of providing the Services.</p>

                <h3>1. Definitions</h3>

                <p>In this Agreement:</p>
                <ul>
                    <li><strong>"Data Protection Laws"</strong> means UK GDPR, the Data Protection Act 2018, and any successor legislation.</li>
                    <li><strong>"Personal Data"</strong>, <strong>"Processing"</strong>, <strong>"Data Subject"</strong>, <strong>"Supervisory Authority"</strong>, and <strong>"Special Categories of Personal Data"</strong> have the meanings given in Data Protection Laws.</li>
                    <li><strong>"Services"</strong> means the image optimisation and processing services provided by Mochify.</li>
                    <li><strong>"Sub-processor"</strong> means any third party engaged by Mochify to process Personal Data on its behalf.</li>
                </ul>

                <h3>2. Processing of Personal Data</h3>

                <p>2.1 The parties acknowledge that for the purposes of Data Protection Laws, the Customer is the Data Controller and Mochify is the Data Processor.</p>

                <p>2.2 Mochify shall process Personal Data only on the documented instructions of the Customer, unless required to do so by applicable law. In such a case, Mochify shall, to the extent permitted by law, inform the Customer of that legal requirement before processing.</p>

                <p>2.3 The subject matter, nature, purpose, and duration of the processing, and the types of Personal Data and categories of Data Subjects are set out in Schedule 1.</p>

                <h3>3. Mochify's Obligations</h3>

                <p>Mochify shall:</p>
                <ol type="a">
                    <li>process Personal Data only on documented instructions from the Customer;</li>
                    <li>ensure that persons authorised to process Personal Data are subject to appropriate confidentiality obligations;</li>
                    <li>implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including as appropriate the measures referred to in Article 32(1) of UK GDPR;</li>
                    <li>not engage any Sub-processor without prior written authorisation of the Customer, and ensure any Sub-processor is subject to equivalent data protection obligations;</li>
                    <li>assist the Customer in responding to requests from Data Subjects exercising their rights under Data Protection Laws;</li>
                    <li>assist the Customer in ensuring compliance with obligations under Articles 32–36 of UK GDPR;</li>
                    <li>at the Customer's choice, delete or return all Personal Data upon termination of the Services, unless applicable law requires storage;</li>
                    <li>make available to the Customer all information necessary to demonstrate compliance with this Agreement and Data Protection Laws, and permit and contribute to audits conducted by the Customer or its appointed auditor on reasonable notice.</li>
                </ol>

                <h3>4. Technical and Organisational Measures</h3>

                <p>4.1 Mochify's core architecture is designed to be zero-persistence: image files uploaded through the Services are processed entirely in RAM and are never written to disk. No image data is retained after processing is complete.</p>

                <p>4.2 Mochify implements appropriate technical and organisational security measures including, but not limited to:</p>
                <ol type="a">
                    <li>in-memory only processing of image data with no disk writes;</li>
                    <li>encrypted communications via TLS for all data in transit;</li>
                    <li>access controls and authentication for administrative systems;</li>
                    <li>regular security reviews of infrastructure and dependencies.</li>
                </ol>

                <h3>5. Sub-processors</h3>

                <p>5.1 The Customer authorises Mochify to engage the sub-processors listed in Schedule 2.</p>

                <p>5.2 Mochify shall give the Customer reasonable prior notice of any intended changes to sub-processors. If the Customer objects to a new sub-processor, the parties shall work in good faith to resolve the objection.</p>

                <h3>6. Data Subject Rights</h3>

                <p>6.1 Mochify shall promptly notify the Customer if it receives a request from a Data Subject exercising any of their rights under Data Protection Laws.</p>

                <p>6.2 Mochify shall not respond to any such request except on the documented instructions of the Customer, or as required by applicable law.</p>

                <h3>7. Personal Data Breaches</h3>

                <p>7.1 Mochify shall notify the Customer without undue delay, and in any event within 48 hours, upon becoming aware of a Personal Data Breach affecting Personal Data processed under this Agreement.</p>

                <p>7.2 Such notification shall include, to the extent available: the nature of the breach, the categories and approximate number of Data Subjects and records concerned, likely consequences, and measures taken or proposed.</p>

                <h3>8. Data Protection Impact Assessments</h3>

                <p>Mochify shall provide reasonable assistance to the Customer where requested in relation to any data protection impact assessment required under Article 35 of UK GDPR.</p>

                <h3>9. International Transfers</h3>

                <p>Mochify shall not transfer Personal Data outside the UK or EEA without the prior written consent of the Customer, unless required by applicable law, and shall ensure that any such transfer is subject to an appropriate safeguard in accordance with Data Protection Laws.</p>

                <h3>10. Term and Termination</h3>

                <p>10.1 This Agreement commences on the date of signature and continues for the duration of the Services.</p>

                <p>10.2 Upon termination or expiry of the Services, Mochify shall, at the Customer's election, delete or return all Personal Data processed under this Agreement within 30 days, unless applicable law requires retention for a longer period.</p>

                <h3>11. Governing Law</h3>

                <p>This Agreement shall be governed by and construed in accordance with the laws of England and Wales. The parties submit to the exclusive jurisdiction of the courts of England and Wales.</p>

                <hr />

                <h3>Schedule 1 — Details of Processing</h3>

                <table>
                    <tr><th>Item</th><th>Details</th></tr>
                    <tr><td><strong>Subject matter</strong></td><td>Image optimisation and processing services</td></tr>
                    <tr><td><strong>Nature of processing</strong></td><td>Temporary in-memory processing of image files uploaded by the Customer or its end users</td></tr>
                    <tr><td><strong>Purpose</strong></td><td>To compress, convert, or otherwise optimise image files as directed by the Customer</td></tr>
                    <tr><td><strong>Duration</strong></td><td>For the duration of the Services agreement</td></tr>
                    <tr><td><strong>Types of Personal Data</strong></td><td>Image files (which may incidentally contain personal data such as EXIF metadata, location data, or identifiable images of individuals)</td></tr>
                    <tr><td><strong>Categories of Data Subjects</strong></td><td>End users and any individuals whose image is contained in an uploaded file</td></tr>
                </table>

                <h3>Schedule 2 — Approved Sub-processors</h3>

                <table>
                    <tr><th>Sub-processor</th><th>Location</th><th>Purpose</th></tr>
                    <tr><td>Cloudflare, Inc.</td><td>USA (SCCs applicable)</td><td>CDN, DNS, edge network, and Workers runtime</td></tr>
                    <tr><td>Supabase, Inc.</td><td>USA (SCCs applicable)</td><td>Authentication and user account data</td></tr>
                </table>

                <hr />

                <h3>Signatures</h3>

                <table>
                    <tr>
                        <th>For and on behalf of Mochify (Data Processor)</th>
                        <th>For and on behalf of Customer (Data Controller)</th>
                    </tr>
                    <tr>
                        <td>Signature: ___________________________</td>
                        <td>Signature: ___________________________</td>
                    </tr>
                    <tr>
                        <td>Name: ___________________________</td>
                        <td>Name: ___________________________</td>
                    </tr>
                    <tr>
                        <td>Title: ___________________________</td>
                        <td>Title: ___________________________</td>
                    </tr>
                    <tr>
                        <td>Date: ___________________________</td>
                        <td>Company: ___________________________</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Date: ___________________________</td>
                    </tr>
                </table>

            </article>

        </div>

    </main>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>

</div>

<style>
    :global(.prose h3, .prose h4) {
        color: #4A2C2C !important;
        font-weight: 800;
        margin-top: 3rem;
        border-bottom: 1px solid #FFF0F3;
        padding-bottom: 0.5rem;
    }
    :global(.prose strong) {
        color: #4A2C2C !important;
        font-weight: 700;
    }
    :global(.prose p, .prose li, .prose td, .prose th) {
        color: #6C3F31 !important;
    }
    :global(.prose th) {
        font-weight: 700;
        background-color: #FFF0F3;
    }
    :global(.prose table) {
        border-collapse: collapse;
        width: 100%;
    }
    :global(.prose td, .prose th) {
        border: 1px solid #FFE5EC !important;
        padding: 0.75rem 1rem !important;
    }
    :global(.prose ol > li::marker) {
        color: #F06292;
        font-weight: 800;
    }
    :global(.prose a),
    :global(.prose a:where(:not(.not-prose))) {
        color: #F06292 !important;
        text-underline-offset: 4px !important;
        text-decoration-thickness: 2px !important;
        text-decoration-color: #FFB3C6 !important;
        font-weight: 700 !important;
    }
    :global(.prose a:hover) {
        color: #ec407a !important;
        text-decoration-color: #F06292 !important;
        background-color: #FFF0F3 !important;
        border-radius: 4px;
    }
    :global(.prose em) {
        color: #875F42 !important;
    }
    hr {
        border: none;
        height: 1px;
        background: linear-gradient(to right, transparent, #FFE5EC, transparent);
        margin: 4rem 0;
    }
</style>
