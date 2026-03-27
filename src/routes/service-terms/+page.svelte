<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import Navigation from '$lib/components/Navigation.svelte';
    
    // Simple state for FAQ toggles if needed, 
    // but <details> works natively without JS overhead!
</script>

<svelte:head>
    <title>Terms of Service - Mochify</title>
    <meta name="description" content="Read Mochify's Terms of Service to understand the terms and conditions for using our image optimization service.">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mochify.app/service-terms">
    <meta property="og:title" content="Terms of Service - Mochify">
    <meta property="og:description" content="Read Mochify's Terms of Service to understand the terms and conditions for using our image optimization service.">
</svelte:head>

<div class="min-h-screen bg-[#FDFBF7] selection:bg-[#FFF0F3] selection:text-pink-900 flex flex-col relative">
    
    <div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjgiIGZpbGw9InJnYmEoMjU1LDI0MCwyNDMsMC4zKSIvPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>


    <Navigation />
    <main class="relative z-10 flex-grow w-full max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <header class="text-center mb-16">
            <div class="flex flex-col items-center gap-2 mb-4">
                <h1 class="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FFB3C6] via-[#E0ACD5] to-[#C5A3E0] bg-clip-text text-transparent leading-tight text-center drop-shadow-sm pb-2 mb-16">
                    Mochify SaaS Terms of Use
				</h1>
            </div>
        </header>

        <article class="prose max-w-none bg-white p-8 md:p-12 rounded-3xl border border-pink-50 shadow-sm max-w-4xl prose-li:my-4">
            <p>These <strong>Terms of Use</strong>, together with any other terms agreed to between the Parties regarding payment and service provision, form the <strong>Licence Agreement</strong> (or the <strong>Agreement</strong>) that is made on the Effective Date between the Parties:</p>

            <ol>
                <li>Mochify of Suite RA01, 195-197 Wood Street, LONDON, E17 3NU, England (the <strong>Provider</strong>); and</li>
                <li>The <strong>User</strong> (or <strong>you</strong>);</li>
            </ol>

            <p>which sets out the terms under which the User is granted a licence by the Provider to use the Provider's Software. Users must only use the Software in accordance with these Terms of Use. By indicating acceptance of these Terms of Use in order to access or use the Software, the User enters into the Agreement and accepts all of these Terms of Use and must always abide by them when using the Software or the Software's output. If you do not agree with these Terms of Use, you must not use the Software.</p>

            <h3>Definitions</h3>
            <ol start="3">
                <li>In this Agreement, the following words are defined:</li>
            </ol>

            <table>
                <thead>
                    <tr>
                        <th>Term</th>
                        <th>Definition</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Business Customer</strong></td>
                        <td>An entity or individual purchasing or using the Software for purposes relating to their trade, business, craft, or profession.</td>
                    </tr>
                    <tr>
                        <td><strong>Confidential Information</strong></td>
                        <td>in relation to any party, any information (whether or not stated to be confidential or marked as such) that is disclosed by that party to a second party, or which that second party obtains from any information disclosed to it by the first party, either orally or in writing or by any other means.</td>
                    </tr>
                    <tr>
                        <td><strong>Consumer</strong></td>
                        <td>an individual purchasing or using the Software as an individual for purposes that are wholly or mainly outside of their trade, business, craft, or profession.</td>
                    </tr>
                    <tr>
                        <td><strong>Effective Date</strong></td>
                        <td>the date on which the User indicates their acceptance of these Terms of Use and of the terms of the Agreement.</td>
                    </tr>
                    <tr>
                        <td><strong>Intellectual Property Rights</strong></td>
                        <td>any invention, patent, utility model right, copyright and related right, registered design, unregistered design right, trade mark, trade name, internet domain name, design right, design, service mark, database rights, topography rights, rights in get-up, rights in goodwill or to sue for passing off, and any other rights of a similar nature, or other industrial or intellectual property rights owned or used by the relevant party in any part of the world whether or not any of the same is registered (or capable of registration), including applications and the right to apply for and be granted, extensions or renewals of, and rights to claim priority from, such rights and all equivalent or similar rights or protections which subsist now or will subsist in the future.</td>
                    </tr>
                    <tr>
                        <td><strong>Parties</strong></td>
                        <td>the Provider and the User; either of which may be referred to singularly within this Agreement as a 'Party'.</td>
                    </tr>
                    <tr>
                        <td><strong>Software</strong></td>
                        <td>The software product, constituting the image optimisation code, the user-facing tool, and any supplementary software, technical infrastructure, or content (e.g. apps or instructive content) that the User is granted access to by the Provider.</td>
                    </tr>
                    <tr>
                        <td><strong>UK Data Protection Laws</strong></td>
                        <td>all UK laws relevant to the regulation of the processing of individuals' personal data (as defined in the UK General Data Protection Regulation (i.e. 'UK GDPR' or the retained Regulation (EU) 2016/679 of the European Parliament and of the Council)), particularly the UK GDPR and the Data Protection Act 2018.</td>
                    </tr>
                </tbody>
            </table>

            <h3>Grant of Licence</h3>
            <ol start="4">
                <li>Subject to these Terms of Use and all other terms comprising the Licence Agreement, the Provider grants the User a limited, revocable, non-exclusive, non-sublicensable, and non-transferable licence for the duration of the Term to use the Software in accordance with these Terms of Use (the <strong>Licence</strong>).</li>
                <li>To access the Software under the Licence, the Provider will require the User to register for an account by providing certain information (e.g. an email address, name, and password).</li>
                <li>The User acknowledges that they are not granted any ownership of the Software or any proprietary rights in the Software (including Intellectual Property Rights) and, as such, the User does not have permission to alter, reproduce, sell, disassemble, edit, rebrand, distribute, lend, hire, or sub-license the Software or any component part of the Software, or otherwise use the Software in a manner only consistent with ownership of the Software.</li>
            </ol>

            <h3>Term and Termination</h3>
            <ol start="7">
                <li>The <strong>Term</strong> of the User's Licence begins on the Effective Date and shall continue until the Agreement is terminated by either Party.</li>
                <li>The User may immediately terminate the Agreement by cancelling their account (either by emailing the Provider requesting that their account be cancelled or by following alternative instructions for such provided by the Provider).</li>
                <li>The Provider may immediately terminate the Agreement by providing written notice to the User of their intention to end the User's Licence to use the Software.</li>
            </ol>

            <h3>Effect of Termination</h3>
            <ol start="10">
                <li>When the Agreement is terminated or expires, the User's Licence to use the Software and the Provider's obligation to provide the Software will end.</li>
                <li>The terms contained in the sections headed “Restrictions on Use”, “Intellectual Property Rights”, “Proprietary Rights to Data”, and “Data Protection and Privacy”, any other terms that by their nature must survive this Agreement, shall remain effective after termination or expiry of the Agreement. All other obligations between the Parties shall end at the time of termination.</li>
            </ol>

            <h3>Fees</h3>
            <ol start="12">
                <li>The User is not and will not be required to pay any fees to access the Software. Paid tiers may be added at a later date.</li>
            </ol>

            <h3>Restrictions on Use</h3>
            <ol start="13">
                <li>To use the Software or to hold a Licence to use the Software, an individual must be aged 18-years-old or older and must be capable of entering into a legal contract for the use of the Software.</li>
                <li>Except as allowed elsewhere in the Agreement, the User must not:</li>
            </ol>
            <ol start="1" type="1">
                <li>Alter, reproduce, sell, disassemble, edit, rebrand, distribute, lend, hire, or sub-license the Software or any right of use of the Software to any other parties;</li>
                <li>Allow others to use the Software via the User's exclusive permitted access (e.g. using the User's email address and account);</li>
                <li>Use the Software, its components, or its output in any way that may infringe the Intellectual Property Rights or any other proprietary rights of the Provider or of any third party;</li>
                <li>Remove or alter any markings that indicate ownership of the Software or of its output, for example, trade mark or copyright symbols;</li>
                <li>Input any parties' personal data or other private information into the Software, or use any of the Software's output that contains such, except in accordance with UK Data Protection Laws and with this Agreement;</li>
                <li>Attempt to reverse engineer or otherwise access or use the Software or its components in order to set up or contribute to an endeavour that may compete with the Provider's Software, whether such an endeavour is commercial or not (e.g. by using aspects of the Software as part of the development of the User's own software product);</li>
                <li>Use the Software to construct any kind of database or to conduct automated or systemic data scraping, data mining, data extraction, or similar data collection activities;</li>
                <li>Negligently or intentionally input content into the Software that introduces any virus, worm, cancelbot, trojan horse, or other destructive or contaminating code or programme;</li>
                <li>Attempt to damage, interfere with, slow, or otherwise alter the Software, its performance, or its integrity;</li>
                <li>If the User is a Consumer, use the Software for any commercial purposes;</li>
                <li>Rely on the Software's output as being factually accurate, up-to-date, or complete;</li>
                <li>Users must not use the Software in any way that damages, disables or overburdens the Website or interferes with any other User's use of the Software;</li>
                <li>Users must not upload any content to the Software that is unlawful, defamatory, obscene, infringing, or that contains viruses or other malicious code;</li>
                <li>Users must not use the Software to infringe any person's intellectual property rights, including by compressing or converting images they do not have the right to use;</li>
                <li>Users must not use automated scripts, bots or scraping tools to access or interact with the Software without the Provider's prior written permission;</li>
                <li>Users must not attempt to reverse engineer, decompile, disassemble or otherwise access the source code of the Software except to the extent expressly permitted by applicable law;</li>
                <li>Users must not use the Software to provide a competing service or to resell, rent or sub-license access to the Software to any third party;</li>
                <li>Input information into the Software or use the Software in a manner that breaches any applicable laws, regulations, or other rules;</li>
                <li>Input information into the Software or use the Software in a manner that is defamatory, unlawful, immoral, tortuous, fraudulent, harmful, or deceptive; or</li>
            </ol>

            <h3>Warranties</h3>
            <ol start="15">
                <li>The Provider warrants that the Software will be provided as a service with reasonable care and skill, as described, and in accordance with these Terms of Use and with any other specifications set out by the Provider and incorporated into the Agreement. If this clause is breached, the User may be entitled to correction of errors or a refund as the Provider considers appropriate.</li>
                <li>If the User is a Consumer, the Provider warrants that the Software is fit for purpose and of satisfactory quality. If this clause is breached, the User may be entitled to a correction of errors or a refund as appropriate.</li>
                <li>Aside from the warranties in the two clauses above, the Provider does not provide any warranties regarding the quality, suitability for particular uses, or other aspects of the Software. In particular:</li>
            </ol>
            <ol start="1" type="1">
                <li>The Provider does not warrant that output produced by the Software is accurate, up-to-date, or complete, and content should not be relied on to provide advice or otherwise treated as factually correct;</li>
                <li>The Provider does not warrant that the Software will always be available and is not responsible for any temporary unavailability (e.g. due to platform or network issues).</li>
            </ol>
            <ol start="18">
                <li>The User warrants that it has the right (via rights or interests in or rights to use) to input into the Software any data that it inputs into the Software. Further, the User warrants that any such data is not harmful, corrupted, unlawful, or otherwise in breach of the Agreement.</li>
                <li>The User warrants that it has a right to use any personal data (as defined by the UK GDPR) that it inputs into the Software. Further, the User warrants that it has a lawful basis for any use made of this personal data in relation to the Software and that all processing of this data that it carries out in relation to the Software is in accordance with the lawful basis for processing and with UK Data Protection Laws generally.</li>
            </ol>

            <h3>Indemnities</h3>
            <ol start="20">
                <li>The Provider shall indemnify the User against all losses, liabilities, costs, expenses, or damages, whether due to claims or action by third parties or otherwise, that the User directly or indirectly incurs arising out of or as a consequence of any breach of the Provider's Warranties set out above under the heading “Warranties”.</li>
                <li>The User shall indemnify the Provider against all losses, liabilities, costs, expenses, or damages, whether due to claims or action by third parties or otherwise, that the Provider directly or indirectly incurs arising out of or as a consequence of any breach of the User's Warranties set out above under the heading “Warranties”.</li>
                <li>The Provider shall indemnify the User against any legal proceedings for infringement of Intellectual Property Rights arising out of the User's use of the Software, in its at-the-time current and unaltered iteration in accordance with the Agreement, that were not caused wholly or in part by the specific manner in which the User used the Software (e.g. due to the specific content that the User entered into the Software). This indemnification is conditional upon the User notifying the Provider of relevant legal proceedings as soon as reasonably possible, the User granting the Provider the sole right to defend the claim(s), and the User offering their reasonable assistance in such.</li>
                <li>The User shall indemnify the Provider against any reasonably foreseeable direct losses, damages, or reasonable expenses that the Provider incurs in relation to the User's breach of the Agreement, the User's infringement of any third party's rights, or the User's otherwise unlawful use of the Software.</li>
            </ol>

            <h3>Limitation of Liability</h3>
            <ol start="24">
                <li>Nothing in this Agreement limits or excludes either Party's liability in any way for:</li>
            </ol>
            <ol start="1" type="1">
                <li>Death or personal injury caused by its negligence;</li>
                <li>Fraud or fraudulent misrepresentation; or</li>
                <li>Any other losses that cannot be limited or excluded by applicable law.</li>
            </ol>
            <ol start="25">
                <li><strong>This clause applies to Consumers only</strong>: except as set out in the first clause of this section (i.e. the section headed “Limitation of Liability”) and in the sections headed “Warranties” and “Indemnities”, the Provider is only liable to the User for loss or damage resulting from the Provider's negligence or the Provider's breach of the Agreement when such loss or damage is foreseeable (i.e. when both the User and the Provider knew at the time the Agreement was formed that this loss or damage may reasonably occur as a result of the Provider's conduct). The Provider is not liable for any unforeseeable loss or damage, any business damage or loss, any loss or damage not caused by the Provider's negligence or breach of the Agreement, or any loss or damage caused by the User's reliance on the output of the Software against these Terms of Use.</li>
                <li><strong>This clause applies to Business Customers only</strong>: except as set out in the first clause of this section (i.e. the section headed “Limitation of Liability”) and in the sections headed “Warranties” and “Indemnities”, the Provider shall not have any direct or indirect liability to the User, whether in contract, tort (including negligence), for breach of statutory duty, or otherwise, arising under or in connection with this Agreement or in connection with the use or lack of use of the Software, for:</li>
            </ol>
            <ol start="1" type="1">
                <li>Loss of profits, business, sales, revenue, opportunity, savings, or contracts;</li>
                <li>Loss of use or corruption of software, data, or information, or damage to equipment;</li>
                <li>Any harm to reputation or goodwill; or</li>
                <li>Any indirect, special, incidental, or consequential loss.</li>
            </ol>
            <ol start="27">
                <li><strong>This clause applies to Business Customers only</strong>: except as set out in the first clause of this section (i.e. the section headed “Limitation of Liability”) and in the sections headed “Warranties” and “Indemnities”, the total liability of the Provider for any losses experienced by the User in respect of any one event or series of connected events in relation to the Provider's conduct in relation to this Agreement shall not exceed the lower of the total aggregate of the payments made by the User to the Provider under this Agreement within the last 12 months or £100.00.</li>
                <li>Particularly, except as set out elsewhere in these Terms of Use, note that the Provider is not responsible for issues that occur as a result of the User's use of the Software that may be due to the Software's use of AI, including but not limited to:</li>
            </ol>
            <ol start="1" type="1">
                <li>Intellectual Property Right infringements occurring due to the User's use of the Software or their use of the output created by use of the Software;</li>
                <li>Losses or inefficiencies incurred due to the provision of inaccurate, misleading, or non-specific information;</li>
                <li>Breaches of UK Data Protection Laws occurring due to the User's use of the Software or their use of the output created by their use of the Software;</li>
                <li>Breaches of equality laws or specific data protection laws related to decision making;</li>
                <li>Breaches of advertising or marketing laws occurring due to the User's use of the Software or their use of the output created by their use of the Software;</li>
                <li>Breaches of defamation laws occurring due to the User's use of the Software or their use of the output created by their use of the Software;</li>
                <li>Breaches of any duty held by the User not to disclose another party's Confidential Information; or</li>
                <li>Losses incurred due to damage to technical infrastructure.</li>
            </ol>

            <h3>Intellectual Property Rights</h3>
            <ol start="29">
                <li>The Provider retains all Intellectual Property Rights it owns in the Software and in aspects of the Provider's wider business, including but not limited to trade marks, copyrights, moral rights, patents, design rights, and data rights.</li>
                <li>The User retains all Intellectual Property Rights it owns in any data or content that they input into the Software or otherwise use as part of their use of the Software.</li>
                <li>The User owns any Intellectual Property Rights arising in, or that it registers in relation to, any original creations produced as output of the Software due to the User's use of the Software in accordance with the Agreement.</li>
                <li>If the User inputs data or content in which the User holds Intellectual Property Rights into the Software, and consequent output of the Software contains elements of this data or content as well as data or content in which the Provider (or, in the case of Intellectual Property Rights that the Provider has permission to use, other parties) holds Intellectual Property Rights, all parties involved will retain ownership of their respective Intellectual Property Rights. This clause qualifies the clause on Intellectual Property Rights ownership immediately preceding this clause. Subject to the indemnities set out above, the User is responsible for ensuring that it does not use any such Software output in a way that infringes on the Intellectual Property Rights of any other parties.</li>
            </ol>

            <h3>Proprietary Rights to Data</h3>
            <ol start="33">
                <li>The User retains all rights, interests, and titles held in any data that it inputs into the Software.</li>
                <li>The User grants the Provider a royalty-free, worldwide, transferable, irrevocable, perpetual licence regarding any data that the User inputs into the Software, under which the Provider may use the data only when anonymised and aggregated with other users' data and only in order to improve the Software (e.g. by incorporating the data into the Software by using it to contribute to training the underlying AI model(s)).</li>
            </ol>

            <h3>Data Protection and Privacy</h3>
            <ol start="35">
                <li>Both the User and the Provider commit to abiding by UK Data Protection Laws in relation to the Software and its development and use. The Provider commits to using any of the User's data that is provided to it only in accordance with UK Data Protection Laws and will not disclose this data to any third parties unless authorised to do so. For more information on how the Provider uses users' data, see the Provider's Website Privacy Policy, accessible here: <a href="https://mochify.app/privacy">mochify.app/privacy</a>.</li>
                <li>The User is responsible for and maintains control over any personal data that it is the data controller of or that it is otherwise responsible for and authorised to use as input into the Software. The User (and not the Provider) is responsible for ensuring that processing of any such personal data using the Software is carried out in reliance on a lawful basis for processing and in accordance with UK Data Protection Laws. If such personal data is:</li>
            </ol>
            <ol start="1" type="1">
                <li>Included in output of the Software, it is the User's responsibility to ensure that use of this output does not infringe upon anybody's data protection rights.</li>
                <li>Used by the Provider to improve the Software under the licence granted to the Provider in the section headed “Proprietary Rights to Data”, the Provider will only use this data in an anonymised and aggregated manner, however, if personal data input by the User is used to improve the Software and is consequently included in an identifiable form in its output or in output from other programmes using the same underlying AI model(s), the User is responsible for any breaches of the relevant data subjects' data protection rights.</li>
            </ol>

            <h3>Service Provision Information</h3>
            <ol start="37">
                <li>The Provider reserves the right to make updates or changes to the Software as necessary to maintain, fix, or improve the Software.</li>
                <li>The User is responsible for ensuring that they have adequate hardware and software to run the Software as intended. The Software has the following compatibility requirements:</li>
            </ol>
            <ol start="1" type="1">
                <li>The Software is accessed via a modern web browser and does not require installation. The Software is compatible with current versions of major browsers (such as Chrome, Firefox, Safari and Edge) that support standard web technologies (HTML5, JavaScript and HTTPS). To use the Software, the User must have a stable internet connection and a device capable of uploading and downloading image files. The Software supports common web image formats (for example JPEG, PNG, WebP and AVIF) as input; the User is responsible for ensuring that their own systems and applications can open and use any compressed or converted files they download.</li>
            </ol>
            <ol start="39">
                <li>Descriptions of the Software are available on the Provider's website. Make sure that you read these before agreeing to the Terms of Use.</li>
                <li>If the User is a Consumer, the User has a statutory right to cancel the Agreement (e.g. their purchase of access to the Software) within a period of 14 days from the date of purchase. However, by accepting these Terms of Use, the User expressly requests the Provider to grant the User immediate access to the Software following the acceptance of the Terms of Use and the User acknowledges that, in making such a request, they waive the right to cancel as described.</li>
                <li>The Software has the following functionality:</li>
            </ol>
            <ol start="1" type="1">
                <li>The Software is a browser-based image optimisation tool that allows a User to upload supported image files (for example JPEG, PNG, WebP, AVIF) and download compressed and/or converted versions for their own use. The Software runs on our servers and processes files in memory only; uploaded files are not permanently stored once processing is complete. The Software does not include any region coding and does not apply digital rights management (DRM) or other technical restrictions to the files you download, beyond standard format and size limits (for example, maximum file size per upload and limits on the number of images per batch in the free tier).</li>
            </ol>
            <ol start="42">
                <li>Any complaints regarding the Software or the Provider's provision of it will be dealt with by the Provider as follows:</li>
            </ol>
            <ol start="1" type="1">
                <li>If a User has a complaint about the Software or the Provider's services, they should contact us at <a href="mailto:complaints@mochify.app">complaints@mochify.app</a> and we will acknowledge receipt within 5 business days and aim to resolve the complaint promptly thereafter.</li>
            </ol>
            <ol start="43">
                <li>The Provider does not provide any after-sales services.</li>
                <li>The Provider can be contacted via email at <a href="mailto:hello@mochify.app">hello@mochify.app</a>.</li>
            </ol>

            <h3>Circumstances Beyond the Control of Either Party (Force Majeure)</h3>
            <ol start="45">
                <li>Neither Party shall be liable for any failure or delay in performing their obligations under this Agreement (e.g. provision of payment or of Software) where such failure or delay results from any cause that is beyond the reasonable control of that Party.</li>
                <li>Such causes include, but are not limited to: power failure, Internet Service Provider failure, acts of God, epidemic, pandemic, civil unrest, fire, flood, droughts, storms, earthquakes, collapse of buildings, explosion or accident, acts of terrorism, acts of war, governmental action, any law, or any action taken by a government or public authority, including without limitation imposing an export or import restriction, quota, or prohibition, or any other event that is beyond the control of the Party in question.</li>
                <li>The Party affected by a circumstance beyond its control shall use all reasonable endeavours to mitigate the effect of the circumstance upon the performance of its obligations.</li>
                <li>The corresponding obligations of the other Party will be suspended to the same extent as those of the Party affected by the force majeure event.</li>
                <li>If the delay continues for a period of 30 days, either Party may terminate the Agreement. Other termination methods, as set out above in the section headed “Term and Termination” may, if applicable, be used to end the Agreement before such a 30-day period has elapsed.</li>
            </ol>

            <h3>General Terms</h3>
            <ol start="50">
                <li>If the User is a Business Customer placing an order on behalf of a business, the User confirms that they have the necessary authority to place the relevant order for and on behalf of that business.</li>
                <li>The Agreement contains the whole agreement between the Parties relating to its subject matter and supersedes all prior discussions, arrangements, or agreements that might have taken place in relation to the Agreement. Nothing in this clause limits or excludes any liability for fraud or fraudulent misrepresentation.</li>
                <li>Except as allowed above, neither Party may assign, transfer, sub-licence, or sub-contract to any third party the benefit and/or burden of the Agreement or of any of the rights under this Agreement without the prior written consent (not to be unreasonably withheld) of the other Party.</li>
                <li>No variation of the Agreement will be valid or binding unless it is recorded in writing and signed by or on behalf of both Parties, except that:</li>
            </ol>
            <ol start="1" type="1">
                <li>Changes may be made by the Provider in accordance with other terms of these Terms of Use; and</li>
                <li>Changes may be made by the Provider to these Terms of Use. The version of the Terms of Use that applies to a specific Agreement are those that are current on the Effective Date. Notification of any changes to the Terms of Use will be made in writing either in a manner that brings notice to the User's attention before they next use the Software (e.g. via a pop-up on a login screen) or via direct communication with the User (e.g. by email). If changes are made to the Terms of Use, the User's use of the Software after the changes are communicated and implemented is deemed to constitute their acceptance of the new Terms. If the User does not wish to accept the new Terms of Use, they can terminate the Agreement in accordance with the provisions above in the section headed “Term and Termination”.</li>
            </ol>
            <ol start="54">
                <li>The Contracts (Rights of Third Parties) Act 1999 does not apply to the Agreement and no third party has any right to enforce or rely on any provision of the Agreement.</li>
                <li>Unless otherwise agreed, no delay, act, or omission by a Party in exercising any right or remedy available in relation to this Agreement will be deemed a waiver of that, or any other, right or remedy.</li>
                <li>If any court or competent authority finds that any provision or part of the Agreement is invalid, illegal, or unenforceable, that provision or part will, to the extent required, be deemed to be deleted, and the validity and enforceability of the other provisions of the Agreement will not be affected.</li>
                <li>Nothing in the Agreement will establish any employment relationship, partnership, or joint venture between the Parties, or mean that one Party becomes the agent of the other Party, nor does the Agreement authorise any Party to enter into any commitments for or on behalf of the other Party.</li>
                <li>Any notice (other than in legal proceedings) to be delivered under the Agreement must be in writing and delivered by email to the email address provided in these Terms of Use (for notices sent to the Provider) or to the email provided by the User when the User registers their account used to access the Software (for notices sent to the User).</li>
            </ol>

            <h3>Governing Law and Jurisdiction</h3>
            <ol start="59">
                <li>This Agreement will be governed by and interpreted according to the laws of England and Wales.</li>
                <li>If the User is a Consumer who resides elsewhere in the UK, the User may also make use of any protections given to the User by the laws of the constituent country in which they reside. All disputes and claims arising under the Agreement where the User is a Consumer (including non-contractual disputes or claims) will be subject to the non-exclusive jurisdiction of the courts of England and Wales.</li>
                <li>If the User is a Business Customer, all disputes and claims arising under the Agreement (including non-contractual disputes or claims) will be subject to the exclusive jurisdiction of the courts of England and Wales.</li>
            </ol>
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
</style>