<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    
    // Simple state for FAQ toggles if needed, 
    // but <details> works natively without JS overhead!
</script>

<svelte:head>
    <title>Privacy Policy - Mochify</title>
    <meta name="description" content="Read Mochify's Privacy Policy to learn how we collect, use, and protect your data when using our image optimization service.">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/privacy">
    <meta property="og:title" content="Privacy Policy - Mochify">
    <meta property="og:description" content="Read Mochify's Privacy Policy to learn how we collect, use, and protect your data when using our image optimization service.">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">
    
    <div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjgiIGZpbGw9InJnYmEoMjU1LDI0MCwyNDMsMC4zKSIvPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>


    <Navigation />
    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <header class="text-center mb-16">
            <div class="flex flex-col items-center gap-2 mb-4">
                <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FFB3C6] via-[#E0ACD5] to-[#C5A3E0] bg-clip-text text-transparent leading-tight text-center drop-shadow-sm pb-2 mb-16">
					Privacy Policy
				</h1>
            </div>
        </header>

        <article class="prose max-w-none bg-white p-8 md:p-12 rounded-3xl border border-pink-50 shadow-sm max-w-4xl prose-li:my-4">
            <p>This Privacy Policy applies between you, the User of this Website, and Mochify, the owner and provider of this Website. Mochify takes the privacy of your information very seriously. This Privacy Policy applies to our use of any and all Data collected by us or provided by you in relation to your use of the Website.</p>

            <p>This Privacy Policy should be read alongside, and in addition to, our Terms and Conditions, which can be found at: mochify.app/terms</p>

            <p>Please read this Privacy Policy carefully.</p>

            <h3>Definitions and Interpretation</h3>
            <ol>
                <li>
                    <p>In this Privacy Policy, the following definitions are used:</p>
                    <ul>
                        <li><strong>Data</strong>: collectively all information that you submit to Mochify via the Website. This definition incorporates, where applicable, the definitions provided in the Data Protection Laws.</li>
                        <li><strong>Data Protection Laws</strong>: any applicable law relating to the processing of personal Data, including but not limited to the GDPR, and any national implementing and supplementary laws, regulations and secondary legislation.</li>
                        <li><strong>GDPR</strong>: the UK General Data Protection Regulation.</li>
                        <li><strong>Mochify, we or us</strong>: Mochify of Suite RA01, 195-197 Wood Street, LONDON, E17 3NU.</li>
                        <li><strong>User or you</strong>: any third party that accesses the Website and is not either (i) employed by Mochify and acting in the course of their employment or (ii) engaged as a consultant or otherwise providing services to Mochify and accessing the Website in connection with the provision of such services.</li>
                        <li><strong>Website</strong>: the website that you are currently using, https://mochify.app, and any sub-domains of this site unless expressly excluded by their own terms and conditions.</li>
                    </ul>
                </li>
                <li>
                    <p>In this Privacy Policy, unless the context requires a different interpretation:</p>
                    <ol type="a">
                        <li>the singular includes the plural and vice versa;</li>
                        <li>references to sub-clauses, clauses, schedules or appendices are to sub-clauses, clauses, schedules or appendices of this Privacy Policy;</li>
                        <li>a reference to a person includes firms, companies, government entities, trusts and partnerships;</li>
                        <li>“including” is understood to mean “including without limitation”;</li>
                        <li>reference to any statutory provision includes any modification or amendment of it;</li>
                        <li>the headings and sub-headings do not form part of this Privacy Policy.</li>
                    </ol>
                </li>
            </ol>

            <h3>Scope of this Privacy Policy</h3>
            <ol start="3">
                <li>This Privacy Policy applies only to the actions of Mochify and Users with respect to this Website. It does not extend to any websites that can be accessed from this Website including, but not limited to, any links we may provide to social media websites.</li>
                <li>For purposes of the applicable Data Protection Laws, Mochify is the “data controller”. This means that Mochify determines the purposes for which, and the manner in which, your Data is processed.</li>
            </ol>

            <h3>Data Collected</h3>
            <ol start="5">
                <li>
                    <p>We may collect the following Data, which includes personal Data, from you:</p>
                    <ol type="a">
                        <li>IP address (automatically collected);</li>
                        <li>web browser type and version (automatically collected);</li>
                        <li>operating system (automatically collected);</li>
                        <li>a list of URLs starting with a referring site, your activity on this Website, and the site you exit to (automatically collected);</li>
                    </ol>
                    <p>in each case, in accordance with this Privacy Policy.</p>
                </li>
            </ol>

            <h4>Image Processing</h4>
            <ol start="6">
                <li>When you upload images to use our compression or conversion service, those image files are processed entirely in RAM (temporary memory) on our servers and discarded immediately after processing is complete. We do not store your images on disk, retain copies after processing, or use them for training AI models or for any marketing purposes. Your images exist on our servers only for the seconds required to compress or convert them.</li>
            </ol>

            <h3>How We Collect Data</h3>
            <ol start="7">
                <li>
                    <p>We collect Data in the following ways:</p>
                    <ol type="a">
                        <li>Data is given to us by you; and</li>
                        <li>Data is collected automatically.</li>
                    </ol>
                </li>
            </ol>

            <h4>Data That is Given to Us by You</h4>
            <ol start="8">
                <li>
                    <p>Mochify will collect your Data in a number of ways, for example:</p>
                    <ol type="a">
                        <li>when you contact us through the Website, by telephone, post, e-mail or through any other means;</li>
                        <li>when you use our services;</li>
                    </ol>
                    <p>in each case, in accordance with this Privacy Policy.</p>
                </li>
            </ol>

            <h4>Data That is Collected Automatically</h4>
            <ol start="9">
                <li>
                    <p>To the extent that you access the Website, we will collect your Data automatically, for example:</p>
                    <ol type="a">
                        <li>we automatically collect some information about your visit to the Website. This information helps us to make improvements to Website content and navigation, and includes your IP address, the date, times and frequency with which you access the Website and the way you use and interact with its content.</li>
                    </ol>
                </li>
            </ol>

            <h3>Our Use of Data</h3>
            <ol start="10">
                <li>
                    <p>Any or all of the above Data may be required by us from time to time in order to provide you with the best possible service and experience when using our Website. Specifically, Data may be used by us for the following reasons:</p>
                    <ol type="a">
                        <li>internal record keeping;</li>
                        <li>improvement of our products / services;</li>
                        <li>security and fraud prevention;</li>
                    </ol>
                    <p>in each case, in accordance with this Privacy Policy.</p>
                </li>
                <li>We may use your Data for the above purposes if we deem it necessary to do so for our legitimate interests. If you are not satisfied with this, you have the right to object in certain circumstances (see the section headed “Your rights” below).</li>
            </ol>

            <h3>Keeping Data Secure</h3>
            <ol start="12">
                <li>
                    <p>We will use technical and organisational measures to safeguard your Data, for example:</p>
                    <ol type="a">
                        <li>access to our systems is restricted to authorised personnel only via secure authentication;</li>
                        <li>we store your Data on secure servers.</li>
                    </ol>
                </li>
                <li>Technical and organisational measures include measures to deal with any suspected data breach. If you suspect any misuse or loss or unauthorised access to your Data, please let us know immediately by contacting us via this e-mail address: hello@mochify.xyz.</li>
                <li>If you want detailed information from Get Safe Online on how to protect your information and your computers and devices against fraud, identity theft, viruses and many other online problems, please visit www.getsafeonline.org. Get Safe Online is supported by HM Government and leading businesses.</li>
            </ol>

            <h3>Data Retention</h3>
            <ol start="15">
                <li>Unless a longer retention period is required or permitted by law, we will only hold your Data on our systems for the period necessary to fulfil the purposes outlined in this Privacy Policy or until you request that the Data be deleted.</li>
                <li>Server logs containing your IP address and visit details are retained for up to 30 days for security monitoring and troubleshooting purposes, then automatically deleted or anonymised.</li>
                <li>Even if we delete your Data, it may persist on backup or archival media for legal, tax or regulatory purposes.</li>
            </ol>

            <h3>Your Rights</h3>
            <ol start="18">
                <li>
                    <p>You have the following rights in relation to your Data:</p>
                    <ol type="a">
                        <li><strong>Right to access</strong> - the right to request (i) copies of the information we hold about you at any time, or (ii) that we modify, update or delete such information. If we provide you with access to the information we hold about you, we will not charge you for this, unless your request is “manifestly unfounded or excessive.” Where we are legally permitted to do so, we may refuse your request. If we refuse your request, we will tell you the reasons why.</li>
                        <li><strong>Right to correct</strong> - the right to have your Data rectified if it is inaccurate or incomplete.</li>
                        <li><strong>Right to erase</strong> - the right to request that we delete or remove your Data from our systems.</li>
                        <li><strong>Right to restrict our use of your Data</strong> - the right to “block” us from using your Data or limit the way in which we can use it.</li>
                        <li><strong>Right to data portability</strong> - the right to request that we move, copy or transfer your Data.</li>
                        <li><strong>Right to object</strong> - the right to object to our use of your Data including where we use it for our legitimate interests.</li>
                    </ol>
                </li>
                <li>To make enquiries, exercise any of your rights set out above, or withdraw your consent to the processing of your Data (where consent is our legal basis for processing your Data), please contact us via this e-mail address: hello@mochify.xyz.</li>
                <li>If you are not satisfied with the way a complaint you make in relation to your Data is handled by us, you may be able to refer your complaint to the relevant data protection authority. For the UK, this is the Information Commissioner's Office (ICO). The ICO's contact details can be found on their website at https://ico.org.uk/.</li>
                <li>It is important that the Data we hold about you is accurate and current. Please keep us informed if your Data changes during the period for which we hold it.</li>
            </ol>

            <h3>Links to Other Websites</h3>
            <ol start="22">
                <li>This Website may, from time to time, provide links to other websites. We have no control over such websites and are not responsible for the content of these websites. This Privacy Policy does not extend to your use of such websites. You are advised to read the Privacy Policy or statement of other websites prior to using them.</li>
            </ol>

            <h3>Changes of Business Ownership and Control</h3>
            <ol start="23">
                <li>Mochify may, from time to time, expand or reduce our business and this may involve the sale and/or the transfer of control of all or part of Mochify. Data provided by Users will, where it is relevant to any part of our business so transferred, be transferred along with that part and the new owner or newly controlling party will, under the terms of this Privacy Policy, be permitted to use the Data for the purposes for which it was originally supplied to us.</li>
                <li>We may also disclose Data to a prospective purchaser of our business or any part of it.</li>
                <li>In the above instances, we will take steps with the aim of ensuring your privacy is protected.</li>
            </ol>

            <h3>General</h3>
            <ol start="26">
                <li>You may not transfer any of your rights under this Privacy Policy to any other person. We may transfer our rights under this Privacy Policy where we reasonably believe your rights will not be affected.</li>
                <li>If any court or competent authority finds that any provision of this Privacy Policy (or part of any provision) is invalid, illegal or unenforceable, that provision or part-provision will, to the extent required, be deemed to be deleted, and the validity and enforceability of the other provisions of this Privacy Policy will not be affected.</li>
                <li>Unless otherwise agreed, no delay, act or omission by a party in exercising any right or remedy will be deemed a waiver of that, or any other, right or remedy.</li>
                <li>This Agreement will be governed by and interpreted according to the law of England and Wales. All disputes arising under the Agreement will be subject to the exclusive jurisdiction of the English and Welsh courts.</li>
            </ol>

            <h3>Changes to This Privacy Policy</h3>
            <ol start="30">
                <li>Mochify reserves the right to change this Privacy Policy as we may deem necessary from time to time or as may be required by law. Any changes will be immediately posted on the Website and you are deemed to have accepted the terms of the Privacy Policy on your first use of the Website following the alterations.</li>
            </ol>

            <p>You may contact Mochify by email at hello@mochify.xyz.</p>

            <h3>ICO Registration</h3>
            <ol start="31">
                <li>Mochify is registered with the UK Information Commissioner's Office (ICO) for data protection compliance. Our ICO registration number is <a href="https://ico.org.uk/ESDWebPages/Entry/ZC088248" target="_blank" rel="noopener noreferrer">ZC088248</a>.</li>
            </ol>

            <h3>Attribution</h3>
            <ol start="32">
                <li>This Privacy Policy was created using a document from Rocket Lawyer (https://www.rocketlawyer.com/gb/en).</li>
            </ol>

            <hr />

            <p>This Privacy Policy was created on 03 February 2026.</p>
        </article>

    </main>

    <div class="mt-16 md:mt-40">
        <Footer />
    </div>

</div>

<style>
    :global(.prose h3, .prose h4) {
        color: #4A2C2C !important; /* Deep Cocoa */
        font-weight: 800;
        margin-top: 3rem;
        border-bottom: 1px solid #FFF0F3;
        padding-bottom: 0.5rem;
    }
    :global(.prose strong) {
        color: #4A2C2C !important; /* Makes bold text stand out without being 'black' */
        font-weight: 700;
    }

    :global(.prose p, .prose li) {
        color: #6C3F31 !important; /* Warm Cocoa for standard text */
    }

    /* Softening the numbers in lists */
    :global(.prose ol > li::marker) {
        color: #F06292; /* Using your Brand Pink for a cute touch */
        font-weight: 800;
    }
    :global(.prose a), 
    :global(.prose a:where(:not(.not-prose))) {
        color: #F06292 !important; /* Brand Pink */
        text-underline-offset: 4px !important;
        text-decoration-thickness: 2px !important;
        text-decoration-color: #FFB3C6 !important; /* Soft Pink Underline */
        font-weight: 700 !important;
    }

    :global(.prose a:hover) {
        color: #ec407a !important;
        text-decoration-color: #F06292 !important;
        background-color: #FFF0F3 !important; /* Strawberry highlight */
        border-radius: 4px;
    }
    hr {
        border: none;
        height: 1px;
        /* Fades from transparent to a soft pink, then back to transparent */
        background: linear-gradient(to right, transparent, #FFE5EC, transparent);
        margin: 4rem 0; /* Generous 'squishy' vertical spacing */
    }
</style>