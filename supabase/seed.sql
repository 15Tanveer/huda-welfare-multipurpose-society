-- Neutral seed data only. No fake staff, volunteers, beneficiaries,
-- testimonials or past events — see AGENTS / README "content rules".

insert into public.site_settings (
  id, organization_name, short_name, tagline, city, state, mission, vision
) values (
  1,
  'HUDA Welfare & Educational Multipurpose Society',
  'HUDA',
  'Working across education, healthcare, skills, empowerment and community development to help create meaningful opportunities for people and communities.',
  'Hinganghat',
  'Maharashtra',
  'To strengthen communities by improving access to education, healthcare awareness, skills, opportunities and social support through practical, inclusive and responsible initiatives.',
  'To build informed, healthy, skilled and empowered communities where people have greater awareness, opportunities and support to improve their lives.'
)
on conflict (id) do nothing;

-- The organization's first planned community program. Details are
-- intentionally generic until an admin fills them in after being
-- finalised — see spec section 15/49 (the 20 September 2026 workflow).
insert into public.programs (
  title, slug, short_description, description, date, city, category, status, featured
) values (
  'Upcoming Community Program',
  'upcoming-community-program-sep-2026',
  'Details will be announced soon.',
  'HUDA Welfare & Educational Multipurpose Society is planning its first community program. Full details — including the venue and schedule — will be announced here as they are finalised.',
  '2026-09-20',
  'Hinganghat',
  'community-rural-development',
  'upcoming',
  true
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Resources & Opportunities — Phase 2 initial curated set
--
-- Every row below was checked against official government sources
-- (MahaDBT / MahaDBT 2.0, myScheme, or the scheme's own ministry/
-- department domain) via web search on 2026-09-02. This sandbox's
-- network policy blocks direct fetches of .gov.in / maharashtra.gov.in
-- pages, so figures were only accepted here when they were corroborated
-- consistently across independent search results and a genuine official
-- domain was identified for `official_url`. Nothing below is guessed:
-- where a specific figure (income limit, benefit amount, deadline,
-- application link) could not be corroborated this way, the field is
-- left NULL rather than invented, and the row is marked
-- 'needs-verification' instead of 'active' when the gap is material.
--
-- `official_url` is the informational/source link. `application_url` is
-- left NULL for every row in this initial set: Maharashtra's ongoing
-- migration to MahaDBT 2.0 means no old deep-link to a specific
-- application step could be confirmed as current, so the public page
-- shows "View Official Information" rather than a possibly-wrong
-- "Apply Now" button for all of these (see 0006_resource_application_url.sql).
--
-- Idempotent via `on conflict (slug) do nothing` — safe to re-run.
-- ---------------------------------------------------------------------

insert into public.resources (
  title, slug, resource_type, category, short_description, description,
  audience, eligibility, benefits, documents_required, how_to_apply,
  important_notes, provided_by, official_url, application_url,
  audience_tags, scope, last_verified_at, featured, status
) values

-- General discovery resources ------------------------------------------------

(
  'Find Government Schemes with myScheme',
  'myscheme-scheme-finder',
  'community-resource',
  'social-welfare',
  'Use the Government of India''s myScheme platform to discover government schemes based on your profile, eligibility and needs.',
  'myScheme is the Government of India''s official one-stop platform for discovering central and state government schemes. Enter basic details such as your age, gender, income, occupation and state, and the platform shows schemes you may be eligible for — including scholarships, subsidies, pensions and welfare benefits — along with eligibility criteria and how to apply.',
  'Anyone looking to discover government schemes relevant to their profile — students, farmers, women, senior citizens, entrepreneurs and general citizens.',
  null,
  null,
  null,
  'Visit myScheme, answer a short set of profile questions (age, gender, state, income, occupation, etc.), and the platform lists schemes you may be eligible for along with links to apply.',
  'myScheme is a discovery tool, not an application portal for every scheme — some schemes link out to their own department portal to complete the application.',
  'Government of India',
  'https://www.myscheme.gov.in/find-scheme',
  null,
  ARRAY['General Citizens','Students','Farmers','Women','Senior Citizens'],
  'central',
  '2026-09-02',
  true,
  'active'
),
(
  'Find Maharashtra Schemes with MahaDBT',
  'mahadbt-maharashtra-portal',
  'community-resource',
  'social-welfare',
  'Explore Maharashtra government scholarships, benefits and welfare schemes through the official MahaDBT platform.',
  'MahaDBT (Maharashtra Direct Benefit Transfer) is the Maharashtra government''s official portal for scholarships, fee reimbursements and welfare-scheme benefits, delivered directly to a beneficiary''s bank account. Students, farmers and other eligible citizens can check which Maharashtra government schemes they qualify for and apply online.',
  'Maharashtra residents — especially students and farmers applying for state welfare schemes.',
  null,
  null,
  null,
  'Visit the MahaDBT portal, register as a new applicant, and check which schemes you are eligible for based on your profile.',
  'Maharashtra has moved several scheme categories to the newer MahaDBT 2.0 portal. If you were using an older MahaDBT link or bookmark, visit the current official portal directly rather than relying on an old link.',
  'Government of Maharashtra',
  'https://mahadbt2.maharashtra.gov.in/',
  null,
  ARRAY['Students','Farmers','General Citizens'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),

-- Education & Scholarships ----------------------------------------------------

(
  'State Minority Scholarship Part II (DHE)',
  'state-minority-scholarship-dhe-part-ii',
  'scholarship',
  'education-scholarships',
  'Fee assistance for minority-community students pursuing graduate and postgraduate courses in Maharashtra, administered by the Directorate of Higher Education.',
  'This Maharashtra state scholarship supports students from notified minority communities (Muslim, Christian, Buddhist, Sikh, Parsi, Jain) who are enrolled in undergraduate or postgraduate courses affiliated with the Directorate of Higher Education (DHE), Maharashtra.',
  'Minority-community students enrolled in DHE-affiliated degree or postgraduate courses in Maharashtra.',
  'Applicant belongs to a notified minority community (Muslim, Christian, Buddhist, Sikh, Parsi or Jain), is a domicile of Maharashtra, and is enrolled in a graduate or postgraduate course affiliated with the Directorate of Higher Education. Family income and course-specific conditions apply as per the scheme''s official guidelines on MahaDBT.',
  'Eligible applicants may receive reimbursement of their annual course fee, or ₹5,000, whichever is less.',
  '- Aadhaar card
- Maharashtra domicile certificate
- Minority community/religion certificate
- Income certificate
- Bonafide/admission certificate from the college
- Bank account details linked to Aadhaar',
  '1. Check eligibility on the MahaDBT portal.
2. Prepare the required documents.
3. Register or log in on the MahaDBT portal.
4. Complete the online application under the ''State Minority Scholarship Part II (DHE)'' scheme.
5. Track your application status on the portal.',
  'Maharashtra has migrated several scholarship categories to the newer MahaDBT 2.0 portal — apply through the current official portal rather than an old bookmarked link.',
  'Directorate of Higher Education, Government of Maharashtra',
  'https://mahadbt2.maharashtra.gov.in/',
  null,
  ARRAY['Students'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),
(
  'Scholarship for Minority Students – Technical & Professional Courses (DTE)',
  'scholarship-minority-dte',
  'scholarship',
  'education-scholarships',
  'Fee assistance for minority-community students pursuing technical and professional courses affiliated with the Directorate of Technical Education, Maharashtra.',
  'A Maharashtra state scholarship for students from notified minority communities pursuing technical or professional courses (such as engineering, pharmacy, architecture and related diploma/degree programs) affiliated with the Directorate of Technical Education (DTE).',
  'Minority-community students in DTE-affiliated technical or professional courses.',
  null,
  null,
  null,
  null,
  'Detailed eligibility, income limit and benefit amount for this DTE-specific scholarship are still being verified against the official scheme notification, so they are not published here yet. Please check the official MahaDBT portal for the current details, or check back here after verification.',
  'Directorate of Technical Education, Government of Maharashtra',
  'https://dte.maharashtra.gov.in/',
  null,
  ARRAY['Students'],
  'maharashtra',
  null,
  false,
  'needs-verification'
),
(
  'Scholarship for Minority Students – Health Science Courses (DMER)',
  'scholarship-minority-dmer',
  'scholarship',
  'education-scholarships',
  'Fee assistance for minority-community students pursuing medical and health-science courses affiliated with the Directorate of Medical Education and Research, Maharashtra.',
  'A Maharashtra state scholarship for students from notified minority communities admitted to medical and allied health-science courses (such as MBBS, BDS, BAMS, BHMS, BUMS and BSc Nursing) affiliated with the Directorate of Medical Education and Research (DMER) / Maharashtra University of Health Sciences.',
  'Minority-community students admitted to DMER-affiliated medical or health-science courses.',
  'Applicant belongs to a notified minority community (Muslim, Buddhist, Christian, Jain, Sikh, Parsi or Jewish); is a domicile of Maharashtra (or has resided in Maharashtra for at least 15 years); is admitted to an eligible medical/health-science course through CET or another competitive admission process; and family annual income does not exceed ₹8 lakh.',
  'Eligible applicants may receive reimbursement of their total annual course fee, or ₹50,000, whichever is less. 30% of the scholarship is reserved for girl students.',
  '- Aadhaar card
- Maharashtra domicile certificate (or proof of 15 years'' residence)
- Minority community/religion certificate
- Income certificate
- CET/admission allotment letter
- Bonafide certificate from the college
- Bank account details linked to Aadhaar',
  '1. Confirm you meet the eligibility criteria.
2. Gather the required documents.
3. Register or log in on the MahaDBT portal.
4. Apply under the minority scholarship scheme for your DMER-affiliated course.
5. Track your application status online.',
  'Applications are processed through MahaDBT. Maharashtra has migrated several scholarship categories to the newer MahaDBT 2.0 portal, so always apply through the current official portal.',
  'Directorate of Medical Education and Research (DMER), Government of Maharashtra',
  'https://mahadbt2.maharashtra.gov.in/',
  null,
  ARRAY['Students','Women'],
  'maharashtra',
  '2026-09-02',
  true,
  'active'
),
(
  'Scholarship for Minority Students – Agricultural Courses (MCAER)',
  'scholarship-minority-mcaer',
  'scholarship',
  'education-scholarships',
  'Fee assistance for minority-community students pursuing agricultural education courses affiliated with the Maharashtra Council of Agricultural Education and Research.',
  'A Maharashtra state scholarship for students from notified minority communities pursuing agricultural education courses affiliated with the Maharashtra Council of Agricultural Education and Research (MCAER).',
  'Minority-community students in MCAER-affiliated agricultural education courses.',
  null,
  null,
  null,
  null,
  'Detailed eligibility, income limit and benefit amount for this MCAER-specific scholarship are still being verified against the official scheme notification, so they are not published here yet. Please check the official MahaDBT portal for the current details, or check back here after verification.',
  'Maharashtra Council of Agricultural Education and Research (MCAER)',
  'https://mahadbt2.maharashtra.gov.in/',
  null,
  ARRAY['Students'],
  'maharashtra',
  null,
  false,
  'needs-verification'
),
(
  'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojana',
  'rajarshi-chhatrapati-shahu-maharaj-shikshan-shulkh-shishyavrutti',
  'scholarship',
  'education-scholarships',
  'Tuition and examination fee assistance for economically backward class students pursuing professional and technical courses in Maharashtra.',
  'This Maharashtra state scheme, run by the Directorate of Higher Education, provides tuition and examination fee assistance to students from the Economically Backward Class (EBC) category who are pursuing professional and technical courses in the state.',
  'EBC-category students pursuing professional or technical courses in Maharashtra.',
  'Applicant belongs to the Economically Backward Class (EBC) category, is a domicile of Maharashtra, and is admitted to a professional or technical course through the Centralised Admission Process (CAP). Family annual income should not exceed ₹8 lakh. The benefit is generally available to the first two children in a family.',
  'Eligible applicants may receive up to 100% waiver or reimbursement of tuition and examination fees.',
  '- Aadhaar card
- Maharashtra domicile certificate
- EBC/income certificate
- CAP admission allotment letter
- Bonafide certificate from the college
- Bank account details linked to Aadhaar',
  '1. Confirm you meet the eligibility criteria.
2. Gather the required documents.
3. Register or log in on the MahaDBT portal.
4. Apply under this scheme for your course.
5. Track your application status online.',
  'Applications are processed through MahaDBT. Always use the current official portal, as Maharashtra has migrated several scheme categories to MahaDBT 2.0.',
  'Directorate of Higher Education, Government of Maharashtra',
  'https://mahadbt2.maharashtra.gov.in/',
  null,
  ARRAY['Students'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),
(
  'Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna',
  'dr-panjabrao-deshmukh-hostel-allowance',
  'scholarship',
  'education-scholarships',
  'Hostel maintenance allowance for Maharashtra students from economically weaker families who study away from home.',
  'This Maharashtra state scheme provides a hostel maintenance allowance to students pursuing professional or technical courses (diploma, graduate or postgraduate) who need to stay away from home to study, helping cover boarding costs.',
  'Maharashtra students in professional/technical courses who live in a hostel away from home.',
  'Applicant is a domicile of Maharashtra, admitted to a professional/technical course (diploma/graduate/postgraduate), and had at least 50% attendance in the previous academic session. Family annual income should not exceed ₹8 lakh (a higher allowance applies for children of marginal farmers or registered labourers).',
  'Eligible applicants with family income up to ₹8 lakh may receive a hostel maintenance allowance of about ₹3,000 per year (Mumbai, Pune, Nagpur, Aurangabad) or ₹2,000 per year (other locations), for 10 months of the academic year. Children of marginal farmers or registered labourers may receive a higher allowance of about ₹30,000 or ₹20,000 per year respectively for the same locations.',
  '- Aadhaar card
- Maharashtra domicile certificate
- Income certificate (or marginal farmer/labourer certificate, where applicable)
- Hostel/accommodation proof
- Previous year''s attendance/academic record
- Bank account details linked to Aadhaar',
  '1. Confirm you meet the eligibility criteria.
2. Gather the required documents.
3. Register on the MahaDBT portal as a new applicant.
4. Apply under the Dr. Panjabrao Deshmukh Hostel Maintenance Allowance scheme.
5. Track your application status online.',
  'Applications are processed through MahaDBT. Always use the current official portal, as Maharashtra has migrated several scheme categories to MahaDBT 2.0.',
  'Government of Maharashtra',
  'https://mahadbt2.maharashtra.gov.in/',
  null,
  ARRAY['Students'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),
(
  'Tuition & Exam Fee Waiver for Girl Students in Professional Courses',
  'tuition-fee-waiver-girls-professional-courses',
  'scholarship',
  'women-child-support',
  '100% tuition and examination fee waiver for girl students from EWS, SEBC and OBC categories in Maharashtra''s professional courses.',
  'The Maharashtra government waives tuition and examination fees for girl students from Economically Weaker Section (EWS), Socially and Educationally Backward Class (SEBC) and Other Backward Class (OBC) categories who are admitted to professional courses, administered by the Directorate of Technical Education.',
  'Girl students from EWS, SEBC or OBC categories admitted to professional courses in Maharashtra.',
  'Applicant is a girl student, is a domicile of Maharashtra, belongs to the EWS, SEBC or OBC category, is admitted to a professional course through the Centralised Admission Process (CAP), and family annual income does not exceed ₹8 lakh.',
  'Eligible applicants may receive a full (100%) waiver of tuition and examination fees for their professional course.',
  '- Aadhaar card
- Maharashtra domicile certificate
- Caste/category certificate (EWS/SEBC/OBC)
- Income certificate
- CAP admission allotment letter
- Bank account details linked to Aadhaar',
  '1. Confirm you meet the eligibility criteria.
2. Gather the required documents.
3. Apply through the MahaDBT portal, or as guided by your college at the time of admission.
4. Track your application/fee-waiver status online.',
  'This fee waiver applies to specified categories (EWS, SEBC, OBC) — students from other categories should check MahaDBT for the scheme applicable to them. Confirm current eligibility on the official DTE notification, as scheme details can be revised.',
  'Directorate of Technical Education, Government of Maharashtra',
  'https://dte.maharashtra.gov.in/',
  null,
  ARRAY['Students','Women'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),
(
  'Post-Matric Scholarship for Persons with Disability',
  'post-matric-scholarship-pwd',
  'scholarship',
  'education-scholarships',
  'Financial support for Maharashtra students with disabilities studying from Class 11 through PhD, including a monthly maintenance allowance.',
  'This Maharashtra state scholarship, run by the Persons with Disabilities Welfare Department, supports students with disabilities studying from Class 11 up to PhD level in recognised institutions.',
  'Students with disabilities studying from Class 11 to PhD level.',
  'Applicant is a domicile of Maharashtra, has a disability of 40% or more certified by a competent medical authority, and is studying in Class 11 to PhD level at a government or government-aided institution in Maharashtra.',
  'Eligible applicants may receive a monthly maintenance allowance of up to ₹1,200, along with coverage of mandatory tuition and examination fees. Additional assistance may be available for study tours or project-related expenses.',
  '- Aadhaar card
- Maharashtra domicile certificate
- Disability certificate (40% or more) from a competent authority
- Bonafide/admission certificate from the institution
- Income certificate (where applicable)
- Bank account details linked to Aadhaar',
  '1. Confirm you meet the eligibility criteria.
2. Gather the required documents.
3. Apply online through the official portal — the application process is free of cost.
4. Track your application status online.',
  'The application must be submitted online only; no fee is charged at any stage of the application process.',
  'Persons with Disabilities Welfare Department, Government of Maharashtra',
  'https://divyangkalyan.maharashtra.gov.in/en/scheme/state-post-matric-scholarship-for-disabled-persons/',
  null,
  ARRAY['Students','Persons with Disabilities'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),

-- Skills & Employment ----------------------------------------------------------

(
  'PM Vishwakarma',
  'pm-vishwakarma',
  'government-scheme',
  'skills-employment',
  'Central government support for traditional artisans and craftspeople — skill training, a toolkit incentive and collateral-free loans.',
  'PM Vishwakarma is a central government scheme for artisans and craftspeople working in 18 traditional trades (such as carpentry, tailoring, pottery and blacksmithing), offering recognition, skill training, a toolkit incentive and access to affordable credit.',
  'Artisans and craftspeople engaged in one of the 18 traditional trades covered by the scheme, working with their own hands and tools in the unorganised sector.',
  'Applicant is at least 18 years old, is engaged in one of the scheme''s 18 eligible family-based traditional trades on a self-employment or unorganised-sector basis, and has not availed a similar central/state government credit-linked scheme for self-employment in the past 5 years. Only one member per family can benefit, and government employees and their families are not eligible.',
  'Eligible applicants may receive recognition as a ''Vishwakarma'' with a certificate and ID, a toolkit incentive of up to ₹15,000, basic and advanced skill training with a stipend during training, and access to a collateral-free enterprise loan at concessional interest, backed by a government interest subvention.',
  '- Aadhaar card
- Proof of trade/occupation
- Bank account details linked to Aadhaar
- Mobile number for verification',
  '1. Check whether your trade is among the 18 eligible trades.
2. Register on the official PM Vishwakarma portal with your Aadhaar and mobile number.
3. Complete biometric verification at a Common Service Centre (CSC), if required.
4. Receive your PM Vishwakarma certificate and ID upon verification.
5. Track your application and loan status on the portal.',
  'The scheme is implemented by the Ministry of Micro, Small and Medium Enterprises. Loan and subsidy amounts are subject to change — confirm current figures on the official portal before applying.',
  'Ministry of Micro, Small and Medium Enterprises, Government of India',
  'https://pmvishwakarma.gov.in/',
  null,
  ARRAY['Artisans','Entrepreneurs'],
  'central',
  '2026-09-02',
  false,
  'active'
),
(
  'Vocational Training Fee Reimbursement (Maharashtra)',
  'vocational-training-fee-reimbursement-maharashtra',
  'training-program',
  'skills-employment',
  'Course fee reimbursement for eligible Maharashtra students enrolled in government-recognised vocational training courses.',
  'The Maharashtra government reimburses vocational training course fees for eligible students studying at government or government-aided vocational training institutions in the state. Several category-specific versions of this scheme exist (for example, for SEBC/Open category students and separately for OBC/VJNT/SBC category students) — check MahaDBT for the exact version applicable to your category.',
  'Maharashtra students enrolled in government-recognised vocational training courses.',
  'Applicant is a domicile of Maharashtra, is studying at a government or government-aided vocational training institution recognised by the state, and meets the category and income conditions of the specific scheme variant applicable to them. Family income up to ₹8 lakh may qualify for full course-fee reimbursement under most variants; lower-income applicants may be covered under Government of India scholarship guidelines instead.',
  'Eligible applicants may receive reimbursement of their vocational training course fee, up to 100% depending on family income and category.',
  '- Aadhaar card
- Maharashtra domicile certificate
- Income certificate
- Caste/category certificate (where applicable)
- Admission/CAP allotment letter
- Mark sheets
- Bank account details linked to Aadhaar',
  '1. Identify the specific scheme variant applicable to your category on MahaDBT.
2. Gather the required documents.
3. Register or log in on the MahaDBT portal.
4. Apply under the applicable Vocational Training Fee Reimbursement scheme.
5. Track your application status online.',
  'Multiple category-specific variants of this scheme exist on MahaDBT. Confirm the exact income limit, category conditions and reimbursement percentage for your applicable variant before applying, as these can differ between variants.',
  'Directorate of Vocational Education and Training (DVET), Government of Maharashtra',
  'https://www.dvet.gov.in/en/',
  null,
  ARRAY['Students','Youth','Job Seekers'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),
(
  'Craftsman Training Scheme Stipend (Government ITIs, Maharashtra)',
  'craftsman-training-scheme-stipend-iti',
  'training-program',
  'skills-employment',
  'Monthly stipend for trainees enrolled in Government Industrial Training Institutes (ITIs) across Maharashtra.',
  'Under the Craftsman Training Scheme, trainees at Government ITIs in Maharashtra receive a monthly stipend to support them during their training period, alongside the vocational training itself.',
  'Trainees enrolled at a Government ITI in Maharashtra.',
  'Applicant is a domicile of Maharashtra, is enrolled as a trainee at a Government ITI, and family annual income does not exceed ₹8 lakh.',
  'Eligible trainees may receive a monthly stipend of ₹500, as per the Government Resolution applicable from the 2023-24 training session, across all categories of trainees.',
  '- Aadhaar card
- Maharashtra domicile certificate
- Income certificate
- ITI admission/enrolment proof
- Bank account details linked to Aadhaar',
  '1. Confirm your enrolment at a Government ITI in Maharashtra.
2. Submit the required documents to your ITI''s administration.
3. The stipend is processed through the applicable government scheme/DBT process, as guided by the institute.',
  'This stipend applies to trainees at Government ITIs; private ITI trainees may be covered under separate provisions — check with your institute or DVET.',
  'Directorate of Vocational Education and Training (DVET), Government of Maharashtra',
  'https://www.dvet.gov.in/en/craftsman-training-scheme/',
  null,
  ARRAY['Students','Youth','Job Seekers'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),

-- Agriculture & Rural Development ----------------------------------------------

(
  'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
  'pm-kisan',
  'government-scheme',
  'agriculture-rural-development',
  'Direct income support of ₹6,000 per year for landholding farmer families across India, paid in three instalments.',
  'PM-KISAN is a central government scheme that provides income support to landholding farmer families to help meet their agricultural and household needs. The benefit is transferred directly into the farmer''s Aadhaar-linked bank account.',
  'Landholding farmer families across India.',
  'Applicant belongs to a farmer family with cultivable land registered in their name as per state land records. Institutional landholders, income-tax payers, government employees, and registered professionals (such as doctors, engineers and lawyers) are not eligible.',
  'Eligible farmer families may receive ₹6,000 per year, paid in three equal instalments of ₹2,000 each, directly into their Aadhaar-linked bank account.',
  '- Aadhaar card
- Land ownership records
- Bank account details linked to Aadhaar',
  '1. Visit the official PM-KISAN portal and select ''New Farmer Registration''.
2. Enter your Aadhaar number and required details.
3. Fill in your land records and bank account information.
4. Submit the application, or apply through your nearest Common Service Centre (CSC) with the required documents.
5. Track your registration and payment status on the portal.',
  'Keep your Aadhaar, bank account and land records updated and correctly linked, as mismatches are a common reason for delayed or rejected instalments.',
  'Department of Agriculture & Farmers Welfare, Government of India',
  'https://pmkisan.gov.in/',
  null,
  ARRAY['Farmers'],
  'central',
  '2026-09-02',
  true,
  'active'
),
(
  'Per Drop More Crop (Micro-Irrigation)',
  'per-drop-more-crop',
  'government-scheme',
  'agriculture-rural-development',
  'Subsidy support for farmers installing drip or sprinkler irrigation systems to improve water-use efficiency.',
  'Per Drop More Crop supports farmers in adopting micro-irrigation — drip and sprinkler irrigation systems — to improve water-use efficiency at the farm level, as part of India''s broader irrigation and agricultural development schemes.',
  'Farmers wishing to install micro-irrigation (drip or sprinkler) systems on their land.',
  'All farmers are generally eligible to apply; small and marginal farmers, women and SC/ST farmers are given priority. Subsidy is typically limited to a maximum landholding of 5 hectares per beneficiary, and only BIS-certified irrigation components are eligible. Aadhaar is required for benefit transfer.',
  'Eligible small and marginal farmers may receive a higher share of subsidy (around 55% of the eligible cost) for installing drip or sprinkler irrigation, while other farmers may receive a lower share (around 45%) — exact rates can vary by state and category.',
  '- Aadhaar card
- Land ownership/tenancy records
- Bank account details linked to Aadhaar
- Quotation from an approved irrigation equipment supplier',
  '1. Contact your local agriculture department office or visit the scheme''s official portal.
2. Get a quotation for BIS-certified micro-irrigation equipment from an approved supplier.
3. Submit your application with the required documents.
4. Subsidy is released after installation and verification.',
  'Implementation details and exact subsidy rates can vary between states — confirm the current rate and process with your local agriculture department before proceeding.',
  'Department of Agriculture & Farmers Welfare, Government of India',
  'https://pmksy.gov.in/',
  null,
  ARRAY['Farmers'],
  'central',
  '2026-09-02',
  false,
  'active'
),
(
  'Farm Mechanization Support (SMAM)',
  'farm-mechanization-smam',
  'government-scheme',
  'agriculture-rural-development',
  'Subsidy on tractors and farm machinery, and support for setting up Custom Hiring Centres, for eligible farmers.',
  'The Sub-Mission on Agricultural Mechanization (SMAM) provides subsidy support to help farmers access modern farm machinery — such as tractors, power tillers, harvesters and other equipment — and supports the setting up of Custom Hiring Centres so more farmers can rent machinery affordably.',
  'Individual farmers, small and marginal farmers, women farmers, and farmer groups (SHGs, FPOs, cooperatives).',
  'Individual farmers, small and marginal farmers, women farmers, SC/ST farmers, and registered farmer groups such as Self-Help Groups (SHGs), Farmer Producer Organisations (FPOs) and cooperatives are eligible to apply, subject to the scheme''s operational guidelines in each state.',
  'Eligible SC/ST, small and marginal, women and North-East farmers may receive a subsidy of around 50% of the machinery cost, while other farmers may receive around 40%, subject to a maximum ceiling. Farmer groups setting up a Custom Hiring Centre may receive a subsidy of up to ₹10 lakh.',
  '- Aadhaar card
- Land ownership/tenancy records
- Category certificate (SC/ST/women/etc., where applicable)
- Bank account details linked to Aadhaar
- Quotation from an approved machinery dealer',
  '1. Check the scheme''s operational guidelines for your state.
2. Apply through the official agricultural machinery portal or your state agriculture department.
3. Submit the required documents along with an equipment quotation.
4. Subsidy is released after purchase and verification.',
  'Subsidy percentages and ceilings can be revised and may vary by state and machinery type — confirm the current rates before purchasing equipment.',
  'Ministry of Agriculture & Farmers Welfare, Government of India',
  'https://agrimachinery.nic.in/',
  null,
  ARRAY['Farmers'],
  'central',
  '2026-09-02',
  false,
  'active'
),
(
  'Mission for Integrated Development of Horticulture (MIDH)',
  'midh-horticulture',
  'government-scheme',
  'agriculture-rural-development',
  'Support for horticulture farmers — nurseries, new orchards, protected cultivation and post-harvest infrastructure.',
  'MIDH supports the holistic development of horticulture in India, covering fruits, vegetables, spices, flowers, plantation and other horticultural crops. It provides financial and technical assistance for activities such as establishing nurseries and new orchards, protected cultivation (poly-houses/green-houses), organic farming, and post-harvest and marketing infrastructure.',
  'Farmers, Farmer Producer Organisations (FPOs), Self-Help Groups and registered entities involved in horticulture.',
  'Individual farmers, FPOs, SHGs, and registered societies, trusts or companies involved in horticulture are eligible, subject to the scheme''s operational guidelines and state-specific conditions.',
  'Eligible applicants may receive financial and technical assistance for activities such as nursery and orchard establishment, protected cultivation, organic farming and post-harvest infrastructure — support is typically shared between the central and state governments, and commercial horticulture projects may receive subsidy up to a specified ceiling.',
  '- Aadhaar card
- Land ownership/tenancy records
- Project proposal (for infrastructure-related components)
- Bank account details linked to Aadhaar',
  '1. Contact your state horticulture department or visit the official MIDH portal.
2. Identify the specific component relevant to you (e.g. nursery, orchard, protected cultivation).
3. Submit an application with the required documents/project details.
4. Assistance is released as per the scheme''s approval and verification process.',
  'MIDH covers many different components with their own specific conditions — confirm the exact eligibility and subsidy details for your chosen component with your state horticulture department.',
  'Ministry of Agriculture & Farmers Welfare, Government of India',
  'https://midh.gov.in/',
  null,
  ARRAY['Farmers'],
  'central',
  '2026-09-02',
  false,
  'active'
),
(
  'Rainfed Area Development (RAD)',
  'rainfed-area-development',
  'government-scheme',
  'agriculture-rural-development',
  'Support for integrated, diversified farming in rainfed and dryland areas — implementation and benefit details vary by district and are being verified.',
  'Rainfed Area Development, implemented under the National Mission for Sustainable Agriculture, promotes an integrated farming systems approach in rainfed areas — combining crops with activities such as livestock, horticulture, agroforestry and fisheries — to help farmers diversify income and manage risk in areas that depend on rainfall rather than assured irrigation.',
  'Farmers in identified rainfed and dryland farming clusters.',
  null,
  null,
  null,
  null,
  'This scheme is implemented on a cluster/watershed basis with benefit details set locally by each state, so specific eligibility and benefit figures for Maharashtra are still being verified against official sources before being published in full. Please check with your local Krishi Vigyan Kendra or District Agriculture Office in the meantime.',
  'Department of Agriculture & Farmers Welfare, Government of India',
  'https://agriwelfare.gov.in/en/RainfedDiv',
  null,
  ARRAY['Farmers'],
  'central',
  null,
  false,
  'needs-verification'
),

-- Social Welfare -----------------------------------------------------------------

(
  'Chief Minister Vayoshree Yojana',
  'cm-vayoshree-yojana',
  'government-scheme',
  'social-welfare',
  'One-time financial assistance for elderly Maharashtra residents to help purchase assistive devices and support their wellbeing.',
  'The Chief Minister Vayoshree Yojana (Mukhyamantri Vayoshri Yojana) is a Maharashtra state welfare scheme for senior citizens, providing one-time financial assistance to help purchase assistive medical equipment such as walking sticks, hearing aids and spectacles, along with support for wellness activities.',
  'Senior citizens (65 years and above) who are permanent residents of Maharashtra.',
  'Applicant is 65 years of age or above, is a permanent resident of Maharashtra, has an Aadhaar card, family annual income does not exceed ₹2 lakh, and has not received a similar equipment/benefit from another scheme in the past three years.',
  'Eligible applicants may receive one-time financial assistance of ₹3,000, transferred directly to their Aadhaar-linked bank account, to help purchase assistive devices.',
  '- Aadhaar card
- Maharashtra domicile/residence proof
- Age proof
- Income certificate
- Bank account details linked to Aadhaar',
  '1. Confirm you meet the eligibility criteria.
2. Gather the required documents.
3. Apply online through the official Chief Minister Vayoshree Yojana portal, or through your local social welfare office.
4. Track your application status online.',
  'This scheme is administered by the Social Justice & Special Assistance Department, Government of Maharashtra.',
  'Social Justice & Special Assistance Department, Government of Maharashtra',
  'https://sjsa.maharashtra.gov.in/en/scheme/chief-minister-vayoshree-scheme/',
  null,
  ARRAY['Senior Citizens'],
  'maharashtra',
  '2026-09-02',
  false,
  'active'
),
(
  'Pradhan Mantri Awas Yojana – Urban (PMAY-U 2.0)',
  'pmay-urban',
  'government-scheme',
  'social-welfare',
  'Central government housing assistance to help eligible urban families construct, purchase or rent an affordable home.',
  'PMAY-U 2.0 provides central government assistance to eligible urban families to construct, purchase or rent a house at an affordable cost, supporting urban poor and middle-class households who do not currently own a home.',
  'Urban families from EWS, LIG or MIG income categories who do not own a pucca house anywhere in the country.',
  'Applicant''s household belongs to the EWS (annual income up to ₹3 lakh), LIG (up to ₹6 lakh) or MIG (up to ₹9 lakh) category, lives in an urban area, and neither the applicant nor any family member owns a pucca house anywhere in India. Preference is given to widows, single women, persons with disabilities, senior citizens, transgender persons, and persons from Scheduled Castes/Scheduled Tribes and minority communities.',
  'Eligible beneficiaries may receive central government assistance of up to ₹2.5 lakh per house, or interest subsidy on a home loan for purchase, construction or repurchase of a house, depending on the scheme vertical they apply under.',
  '- Aadhaar card
- Income certificate/proof of income category (EWS/LIG/MIG)
- Proof that the family does not own a pucca house
- Bank account details linked to Aadhaar
- Property/land documents (for construction) or agreement (for purchase), where applicable',
  '1. Check your income category (EWS/LIG/MIG) and confirm you don''t already own a pucca house.
2. Visit the official PMAY-Urban portal and check your eligibility.
3. Apply online, or through your local Urban Local Body (municipal corporation/council) office.
4. Track your application status on the portal.',
  'PMAY-U 2.0 has multiple verticals (such as beneficiary-led construction, affordable housing in partnership, and interest subsidy) — the exact benefit depends on which vertical you apply under.',
  'Ministry of Housing & Urban Affairs, Government of India',
  'https://pmaymis.gov.in/',
  null,
  ARRAY['General Citizens'],
  'central',
  '2026-09-02',
  false,
  'active'
)

on conflict (slug) do nothing;
