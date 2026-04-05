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
                        <span>This document sets out the terms under which Mochify (as <strong class="text-[#4A2C2C]">Supplier / Data Processor</strong>) processes image data on behalf of your business (as <strong class="text-[#4A2C2C]">Customer / Data Controller</strong>)</span>
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

                <p>This Data Processing Agreement (<strong>"DPA"</strong>) is made on the date of last signature below between:</p>

                <h3>Parties</h3>

                <ol>
                    <li>Taylor Liesnham trading as <strong>Mochify</strong> of Suite RA01, 195-197 Woodhouse Road, London, E17 3NU, England (<strong>"Supplier"</strong>); and</li>
                    <li>[Company name], a company incorporated in England and Wales under No. [Company number], whose registered office is at [Address line 1], [Address line 2], [County], [Postcode] (<strong>"Customer"</strong>).</li>
                </ol>

                <p>(each a <strong>"party"</strong> and together the <strong>"parties"</strong>)</p>

                <h3>Background</h3>

                <ol start="3">
                    <li>The Supplier is a provider of image compression, optimisation, and format conversion services, processing image files in-memory with zero data retention on behalf of the Customer (<strong>"Services"</strong>).</li>
                    <li>The parties entered into an agreement for the provision of services on [DATE] (<strong>"Agreement"</strong>).</li>
                    <li>The parties have agreed to enter into this DPA in relation to the processing of personal data by the Supplier in the course of providing the Services. The terms of this DPA are intended to apply in addition to and not in substitution of the terms of the Agreement.</li>
                </ol>

                <h3>Agreement</h3>

                <h4>Meanings</h4>

                <ol>
                    <li>In this DPA, the following words are defined:</li>
                </ol>

                <table>
                    <thead>
                        <tr><th>Term</th><th>Definition</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Affiliate</strong></td>
                            <td>Any entity that directly or indirectly controls, or is controlled by, or is under common control with the subject entity. "Control" means direct or indirect ownership or control of more than 50% of the voting interests of the subject entity.</td>
                        </tr>
                        <tr>
                            <td><strong>Data Protection Law</strong></td>
                            <td>(a) All laws and regulations applicable to the Processing of Personal Data under the Agreement, including EU Directive 95/46/EC, the GDPR and laws implementing or supplementing the GDPR; and (b) to the extent applicable, the data protection or privacy laws of any other country.</td>
                        </tr>
                        <tr>
                            <td><strong>GDPR</strong></td>
                            <td>(a) Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 (<strong>"EU GDPR"</strong>); and (b) the EU GDPR as implemented or adopted under the laws of the United Kingdom (<strong>"UK GDPR"</strong>).</td>
                        </tr>
                        <tr>
                            <td><strong>Personnel</strong></td>
                            <td>In relation to a party, those of its employees, workers, agents, consultants, contractors, sub-contractors, representatives or other persons employed or engaged by that party.</td>
                        </tr>
                        <tr>
                            <td><strong>Sub-processor</strong></td>
                            <td>Any entity appointed by or on behalf of the Supplier to process Personal Data on behalf of the Customer under this DPA.</td>
                        </tr>
                        <tr>
                            <td><strong>Working Day</strong></td>
                            <td>Any day, other than a Saturday, Sunday, or public holiday in England and Wales.</td>
                        </tr>
                    </tbody>
                </table>

                <ol start="2">
                    <li>Terms such as "Data Subject", "Processing", "Personal Data", "Controller", "Processor", "Supervisory Authority" and "Personal Data Breach" shall have the same meaning as ascribed to them in the Data Protection Law.</li>
                    <li>In this DPA unless the context requires a different interpretation: (a) the singular includes the plural and vice versa; (b) "including" is understood to mean "including without limitation"; (c) reference to any statutory provision includes any modification or amendment of it; (d) the headings do not form part of this DPA; and (e) "writing" or "written" will include email unless otherwise stated.</li>
                </ol>

                <h4>Processing Customer Personal Data</h4>

                <ol start="4">
                    <li>For the purpose of Data Protection Law, the Customer shall be the Controller and the Supplier shall be the Processor.</li>
                    <li>The Supplier and each Supplier Affiliate shall: (a) comply with all applicable Data Protection Law in the Processing of Customer Personal Data; and (b) only Process Personal Data on the Customer's documented instructions, unless Processing is required by applicable law.</li>
                    <li>The Supplier shall take reasonable steps to ensure the reliability of Personnel who have access to Personal Data, ensuring such Personnel is subject to a strict duty of confidentiality and Processes Personal Data only for the purpose of delivering the Services.</li>
                </ol>

                <h4>Security</h4>

                <ol start="7">
                    <li>The Supplier will establish data security in relation to the Processing of Personal Data under this DPA, guaranteeing a protection level appropriate to the risk. Such measures may include: (a) pseudonymisation and encryption of Personal Data; (b) ongoing confidentiality, integrity, availability and resilience of processing systems; (c) ability to restore availability of Personal Data in a timely manner in the event of an incident; and (d) a process for regularly testing and evaluating the effectiveness of technical and organisational measures.</li>
                    <li>In assessing the appropriate level of security, the Supplier shall take into account any risks presented by the Processing, in particular from a Personal Data Breach.</li>
                    <li>The Supplier has laid down the technical and organisational measures in Schedule 2 of this DPA. The Supplier may implement alternative adequate measures from time to time and shall notify the Customer in writing where it has done so.</li>
                </ol>

                <h4>Sub-Processors</h4>

                <ol start="10">
                    <li>The Customer authorises the Supplier to appoint the Sub-processors listed in Schedule 3 (if any) and any new Sub-processors in accordance with the subsequent provisions.</li>
                    <li>With respect to each Sub-processor, the Supplier shall: (a) carry out appropriate due diligence prior to Processing; (b) enter into a written agreement incorporating terms substantially similar to those in this DPA meeting the requirements of Article 28(3) of UK GDPR; and (c) remain fully liable to the Customer for all acts or omissions of such Sub-processor.</li>
                    <li>The Supplier shall give the Customer prior written notice of the appointment of any new Sub-processor.</li>
                    <li>If within 30 days of receipt of such notice the Customer notifies the Supplier of any objections: (a) the parties will work in good faith to make available a commercially reasonable change; and (b) if such a change cannot be made within 30 days, the Customer may serve written notice to terminate the Agreement to the extent that the provision of the Services is affected.</li>
                </ol>

                <h4>Data Subject Rights</h4>

                <ol start="14">
                    <li>The Supplier shall assist the Customer in implementing appropriate technical and organisational measures for the fulfilment of the Customer's obligation to respond to Data Subject requests under Data Protection Law.</li>
                    <li>The Supplier shall: (a) promptly (and within 24 hours) notify the Customer if it receives a request from a Data Subject; and (b) fully cooperate with and assist the Customer in relation to any such request.</li>
                </ol>

                <h4>Personal Data Breaches</h4>

                <ol start="16">
                    <li>The Supplier shall: (a) notify the Customer without undue delay (no later than 72 hours) upon becoming aware of any Personal Data Breach; (b) provide sufficient information to enable the Customer to evaluate the impact; (c) provide the Customer with such assistance as reasonably requested; and (d) cooperate with the Customer to assist in the evaluation, investigation, mitigation and remediation of each Personal Data Breach.</li>
                </ol>

                <h4>Data Protection Impact Assessment and Prior Consultation</h4>

                <ol start="17">
                    <li>The Supplier shall provide reasonable assistance to the Customer with any data protection impact assessments and prior consultations with Supervisory Authorities pursuant to Articles 35 and 36 of the UK GDPR, limited to the Processing of Personal Data under this DPA.</li>
                </ol>

                <h4>Return and Deletion of Personal Data</h4>

                <ol start="18">
                    <li>The Supplier shall, within 30 days of the expiry or termination of the Agreement, delete or return all copies of Personal Data Processed on behalf of the Customer.</li>
                    <li>The Supplier may retain Personal Data to the extent required by applicable law, notifying the Customer of any such requirement and ensuring the confidentiality of such data.</li>
                    <li>The Customer may require the Supplier to provide written certification confirming compliance with this section.</li>
                </ol>

                <h4>Audits</h4>

                <ol start="21">
                    <li>The Supplier shall make available to the Customer on request all information necessary to demonstrate compliance with this DPA.</li>
                    <li>The Supplier shall allow for and contribute to audits, including inspections, by the Customer (or any auditor mandated by the Customer), provided the Customer gives reasonable notice and makes all reasonable endeavours to avoid disruption.</li>
                    <li>Such audit rights may be exercised only once in any calendar year during the term of the Agreement and for a period of 3 years following expiry or termination.</li>
                </ol>

                <h4>Liability</h4>

                <ol start="24">
                    <li>Nothing in this DPA limits or excludes either party's liability for death or personal injury caused by its negligence, or fraud or fraudulent misrepresentation.</li>
                    <li>Subject to the preceding clause, the total liability of either party for any non-compliance with this DPA shall be subject to any limitation regarding monetary damages set forth in the Agreement.</li>
                </ol>

                <h4>General Terms</h4>

                <ol start="26">
                    <li>This DPA shall be coterminous with the Agreement.</li>
                    <li>No party may assign, transfer or sub-contract to any third party the benefit and/or burden of this DPA without the prior written consent of the other party.</li>
                    <li>No variation of this DPA will be valid or binding unless recorded in writing and signed by or on behalf of both parties.</li>
                    <li>The Contracts (Rights of Third Parties) Act 1999 does not apply to this DPA.</li>
                    <li>Any notice to be delivered under this DPA must be in writing and delivered by pre-paid first class post or hand delivery to the other party's registered address or place of business, or sent by email.</li>
                </ol>

                <h4>Governing Law and Jurisdiction</h4>

                <ol start="31">
                    <li>This DPA will be governed by and interpreted according to the law of England and Wales and all disputes shall be subject to the exclusive jurisdiction of the English and Welsh courts.</li>
                </ol>

                <hr />

                <h3>Signatures</h3>

                <table>
                    <thead>
                        <tr>
                            <th>Supplier (Data Processor)</th>
                            <th>Customer (Data Controller)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Taylor Liesnham | Owner | Mochify</td>
                            <td>[Name] | [Title] | [Company]</td>
                        </tr>
                        <tr>
                            <td>Signature: ___________________________</td>
                            <td>Signature: ___________________________</td>
                        </tr>
                        <tr>
                            <td>Date: ___________________________</td>
                            <td>Date: ___________________________</td>
                        </tr>
                    </tbody>
                </table>

                <hr />

                <h3>Schedule 1 — Processing Activities</h3>

                <p><strong>Nature and purpose of Processing:</strong> The Supplier will Process Personal Data as necessary to provide the Services pursuant to the Agreement, and as further instructed by the Customer.</p>

                <p><strong>Types of Personal Data:</strong></p>
                <ul>
                    <li>Image file metadata, which may incidentally include EXIF data such as geolocation, device identifiers, and photographer information embedded within uploaded image files.</li>
                </ul>

                <p><strong>Categories of Data Subject:</strong></p>
                <ul>
                    <li>Customers of the Customer (including their staff)</li>
                    <li>Other people that the Customer deals with</li>
                </ul>

                <p><strong>Obligations and rights of the Customer:</strong> Set out in the Agreement and this DPA.</p>

                <h3>Schedule 2 — Technical and Organisational Measures</h3>

                <p>The Supplier will conduct the activities covered by this DPA in compliance with its Information Security Policy and data protection policies, available online at: <strong>https://mochify.app/privacy</strong></p>

                <p>The Supplier also has the following technical and organisational measures in place:</p>
                <ul>
                    <li>All uploaded image files are processed entirely in-memory and are never written to disk or retained after processing is complete, ensuring zero data persistence.</li>
                    <li>All data in transit is encrypted using HTTPS/TLS. Server access is restricted to authorised personnel only, with access controls and secure authentication in place.</li>
                </ul>

                <h3>Schedule 3 — Sub-Processors</h3>

                <p>The Customer agrees that the Supplier may sub-contract certain obligations under this DPA to the following Sub-processors:</p>

                <p><em>None at the date of this agreement.</em></p>

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
