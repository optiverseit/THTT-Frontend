import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_work_permit_doc():
    doc = Document()

    # Set page margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    PURPLE_HEX = "2D1347"
    PINK_HEX = "D92671"
    DARK_TEXT = "1E293B"
    LIGHT_BG = "F8FAFC"
    BORDER_COLOR = "CBD5E1"

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = p_title.add_run("THTT - Work Permit (श्रम स्वीकृति) Module\nDatabase Architecture & Backend Specifications")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(20)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x2D, 0x13, 0x47)

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sub = p_sub.add_run("Comprehensive Database Design, Entity Relationships, SQL DDL & API Contract\nTrip Himalaya Tours & Travels (THTT) Web Application")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Helper for headings
    def add_custom_heading(text, level=1):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        run = p.add_run(text)
        run.font.name = "Arial"
        run.font.bold = True
        if level == 1:
            run.font.size = Pt(15)
            run.font.color.rgb = RGBColor(0x2D, 0x13, 0x47)
        elif level == 2:
            run.font.size = Pt(13)
            run.font.color.rgb = RGBColor(0xD9, 0x26, 0x71)
        else:
            run.font.size = Pt(11)
            run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        return p

    def add_body_p(text, bold_prefix="", italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.font.name = "Arial"
            r_bold.font.bold = True
            r_bold.font.size = Pt(10)
            r_bold.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        r_text = p.add_run(text)
        r_text.font.name = "Arial"
        r_text.font.size = Pt(10)
        r_text.font.italic = italic
        r_text.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
        return p

    # 1. EXECUTIVE SUMMARY
    add_custom_heading("1. Executive Summary & Domain Overview", level=1)
    add_body_p("The Work Permit (श्रम स्वीकृति - Online Shram) module is a critical service in the THTT platform designed to manage foreign employment clearances, document attestation, insurance contributions, and Government Foreign Employment Office (FEO/FEIMS) submissions for Nepali migrant workers traveling to GCC, East Asian, and European destinations.")

    add_body_p("This document outlines the complete relational schema, data dictionary, entity relationships, SQL definitions, validation logic, and backend API contracts required for building the backend database and microservices.")

    # 2. KEY BUSINESS RULES
    add_custom_heading("2. Core Business Rules & Domain Logic", level=1)
    
    add_body_p(" Supported types are: (1) New Labour Permit (Naya Shram), (2) Renewal Permit (Purna Shram / Re-entry), (3) Individual Permit (Byaktigat Shram), and (4) Legalization & Embassy Attestation.", bold_prefix="• Permit Types: ")
    add_body_p(" Due to government regulations, all applicant birth dates must be captured and synchronized in both Gregorian (AD) and Bikram Sambat (BS).", bold_prefix="• Dual-Date Calendar System: ")
    add_body_p(" Government mandatory fees (Social Security Fund - SSF, Foreign Employment Welfare Fund, Term Life Insurance, and Agency fee) are stratified strictly by the applicant's age:", bold_prefix="• Age-Tiered Pricing Matrix: ")

    # Pricing Table
    table_p = doc.add_table(rows=4, cols=4)
    table_p.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Age Bracket", "Min-Max Age", "Total Cost (NPR)", "Breakdown Components"]
    for i, h in enumerate(headers):
        cell = table_p.cell(0, i)
        cell.text = h
        set_cell_background(cell, "2D1347")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.name = "Arial"
            r.font.bold = True
            r.font.size = Pt(9.5)
            r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    pricing_data = [
        ("Below 35 years", "18 – 34 yrs", "Rs. 11,000", "Welfare: 1,500 | SSF: 2,000 | Insurance: 5,000 | Service: 2,500"),
        ("35 – 50 years", "35 – 50 yrs", "Rs. 12,500", "Welfare: 1,500 | SSF: 2,000 | Insurance: 6,500 | Service: 2,500"),
        ("Above 51 years", "51 – 65 yrs", "Rs. 15,500", "Welfare: 1,500 | SSF: 2,000 | Insurance: 9,500 | Service: 2,500"),
    ]

    for row_idx, data in enumerate(pricing_data, start=1):
        for col_idx, text in enumerate(data):
            cell = table_p.cell(row_idx, col_idx)
            cell.text = text
            if row_idx % 2 == 1:
                set_cell_background(cell, "F1F5F9")
            p = cell.paragraphs[0]
            if col_idx in [1, 2]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.name = "Arial"
                r.font.size = Pt(9)
                r.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    add_body_p(" (a) New Permit: Passport Copy, Visa Copy, MRP Photo. (b) Renewal Permit: Passport Copy, Visa Copy, Nepal Immigration Arrival Stamp. (c) Company Change: Must additionally provide new Employment Agreement / Job Offer Letter.", bold_prefix="• Document Upload Rules: ")
    add_body_p(" Submitted -> Document Verification -> SSF & Insurance Paid -> FEO/FEIMS Processing -> Approved / Issued -> Cancelled/Rejected.", bold_prefix="• Application Lifecycle: ")

    # 3. ENTITY RELATIONSHIP ARCHITECTURE
    add_custom_heading("3. Entity Relationship Structure & Relations", level=1)
    add_body_p("The database is normalized across 6 interconnected core entities:")
    add_body_p(" Stores all authorized destination countries (UAE, Qatar, Saudi, Kuwait, Malaysia, Croatia, Romania, etc.) with metadata, visa rules, and country flags.", bold_prefix="1. destination_countries (1 : N): ")
    add_body_p(" Master lookup table for age brackets, welfare fund rates, SSF contributions, and insurance premiums.", bold_prefix="2. permit_fee_tiers (1 : N): ")
    add_body_p(" Central entity storing applicant details, dual DOB (AD & BS), calculated age, passport info, job title, employer, company change flag, status, and FEIMS reference.", bold_prefix="3. work_permit_applications (Parent): ")
    add_body_p(" Stores uploaded document scans (Passport, Visa, Arrival Stamp, Agreement, Photos) with S3 URLs, MIME types, and verification timestamps.", bold_prefix="4. permit_documents (N : 1): ")
    add_body_p(" Financial transactions linked to the application with eSewa/Khalti/ConnectIPS gateways and payment statuses.", bold_prefix="5. permit_payments (N : 1): ")
    add_body_p(" Complete audit logging of status transitions, timestamps, admin remarks, and operational history.", bold_prefix="6. permit_status_history (N : 1): ")

    # 4. DATA DICTIONARY TABLES
    add_custom_heading("4. Comprehensive Data Dictionary", level=1)

    def render_schema_table(table_name, columns):
        add_custom_heading(f"Table: {table_name}", level=2)
        tbl = doc.add_table(rows=len(columns)+1, cols=5)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        col_widths = [1.3, 1.0, 0.9, 0.8, 2.5]
        
        headers = ["Column Name", "Data Type", "Constraint", "Default", "Description"]
        for i, h in enumerate(headers):
            cell = tbl.cell(0, i)
            cell.text = h
            set_cell_background(cell, "2D1347")
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.name = "Arial"
                r.font.bold = True
                r.font.size = Pt(8.5)
                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

        for row_idx, col_data in enumerate(columns, start=1):
            for c_idx, val in enumerate(col_data):
                cell = tbl.cell(row_idx, c_idx)
                cell.text = str(val)
                if row_idx % 2 == 1:
                    set_cell_background(cell, "F8FAFC")
                p = cell.paragraphs[0]
                for r in p.runs:
                    r.font.name = "Arial"
                    r.font.size = Pt(8)
                    r.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 4.1 destination_countries
    render_schema_table("destination_countries", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique primary key identifier"),
        ("country_code", "VARCHAR(50)", "UNIQUE, NOT NULL", "-", "Unique slug e.g. 'uae', 'qatar', 'saudi'"),
        ("country_name", "VARCHAR(150)", "NOT NULL", "-", "Full destination name e.g. 'United Arab Emirates'"),
        ("iso_2", "CHAR(2)", "NOT NULL", "-", "ISO 3166-1 alpha-2 code e.g. 'AE', 'QA'"),
        ("flag_code", "VARCHAR(10)", "NOT NULL", "-", "Country flag code used for UI flag badges"),
        ("short_description", "VARCHAR(255)", "NULL", "-", "Short description of coverage area"),
        ("processing_days", "VARCHAR(50)", "DEFAULT", "'2-3 Days'", "Standard turnaround time"),
        ("is_active", "BOOLEAN", "NOT NULL", "TRUE", "Status flag for active country destinations"),
        ("display_order", "INTEGER", "DEFAULT", "0", "Sort order in dropdown and grid cards"),
    ])

    # 4.2 permit_fee_tiers
    render_schema_table("permit_fee_tiers", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique tier identifier"),
        ("age_group_label", "VARCHAR(100)", "NOT NULL", "-", "Display label e.g. 'Below 35 years'"),
        ("min_age", "INT", "NOT NULL", "18", "Minimum inclusive age"),
        ("max_age", "INT", "NOT NULL", "-", "Maximum inclusive age (34, 50, 65)"),
        ("welfare_fund_npr", "DECIMAL(10,2)", "DEFAULT", "1500.00", "Baideshik Rojgar Kalyan Kosh contribution"),
        ("ssf_contribution_npr", "DECIMAL(10,2)", "DEFAULT", "2000.00", "Social Security Fund (SSF) contribution"),
        ("insurance_premium_npr", "DECIMAL(10,2)", "NOT NULL", "-", "Term Life/Health Insurance premium"),
        ("service_fee_npr", "DECIMAL(10,2)", "DEFAULT", "2500.00", "Agency application processing fee"),
        ("total_cost_npr", "DECIMAL(10,2)", "NOT NULL", "-", "Total payable (11000, 12500, 15500 NPR)"),
    ])

    # 4.3 work_permit_applications
    render_schema_table("work_permit_applications", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique application primary key"),
        ("application_number", "VARCHAR(50)", "UNIQUE, NOT NULL", "-", "Human readable ID e.g. 'WP-2026-00891'"),
        ("user_id", "UUID", "FOREIGN KEY, NULL", "-", "FK to users table (if authenticated user)"),
        ("country_id", "UUID", "FOREIGN KEY, NOT NULL", "-", "FK to destination_countries(id)"),
        ("fee_tier_id", "UUID", "FOREIGN KEY, NOT NULL", "-", "FK to permit_fee_tiers(id)"),
        ("permit_type", "ENUM", "NOT NULL", "'new_labour_permit'", "new | renewal | individual | legalization"),
        ("applicant_full_name", "VARCHAR(255)", "NOT NULL", "-", "Full name as written on passport"),
        ("phone_number", "VARCHAR(20)", "NOT NULL", "-", "Valid 10-digit Nepali mobile number"),
        ("email", "VARCHAR(255)", "NULL", "-", "Contact email for notifications"),
        ("dob_ad", "DATE", "NOT NULL", "-", "Date of Birth in Gregorian calendar"),
        ("dob_bs", "VARCHAR(20)", "NOT NULL", "-", "Date of Birth in Bikram Sambat (YYYY-MM-DD)"),
        ("calculated_age", "INT", "NOT NULL", "-", "Age calculated dynamically from DOB"),
        ("passport_number", "VARCHAR(50)", "NOT NULL", "-", "Valid Nepali passport number"),
        ("passport_expiry_date", "DATE", "NULL", "-", "Passport expiry date (min 6 months validity)"),
        ("job_title", "VARCHAR(150)", "NULL", "-", "Profession/Designation abroad"),
        ("employer_company_name", "VARCHAR(255)", "NULL", "-", "Sponsor company name abroad"),
        ("company_changed", "BOOLEAN", "DEFAULT", "FALSE", "True if changing sponsor on renewal"),
        ("previous_shram_number", "VARCHAR(100)", "NULL", "-", "Previous Shram clearance sticker number"),
        ("status", "ENUM", "DEFAULT", "'submitted'", "submitted | verification | feo_processing | approved | issued"),
        ("rejection_reason", "TEXT", "NULL", "-", "Reason for rejection if denied by FEO/Agency"),
        ("feims_reference_number", "VARCHAR(100)", "NULL", "-", "Govt FEIMS portal reference number"),
        ("created_at", "TIMESTAMP WITH TZ", "DEFAULT", "CURRENT_TIMESTAMP", "Submission timestamp"),
        ("updated_at", "TIMESTAMP WITH TZ", "DEFAULT", "CURRENT_TIMESTAMP", "Last modification timestamp"),
    ])

    # 4.4 permit_documents
    render_schema_table("permit_documents", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique document ID"),
        ("application_id", "UUID", "FOREIGN KEY, NOT NULL", "-", "FK to work_permit_applications(id) ON DELETE CASCADE"),
        ("document_type", "ENUM", "NOT NULL", "-", "passport_copy | arrival_stamp | visa_copy | agreement_paper | mrp_photo"),
        ("file_name", "VARCHAR(255)", "NOT NULL", "-", "Original file name"),
        ("file_url", "TEXT", "NOT NULL", "-", "Cloud storage secure URL (S3 / Cloudinary)"),
        ("file_mime_type", "VARCHAR(100)", "NOT NULL", "-", "'image/jpeg', 'image/png', 'application/pdf'"),
        ("file_size_bytes", "BIGINT", "NOT NULL", "-", "File size in bytes (max 10MB)"),
        ("is_verified", "BOOLEAN", "DEFAULT", "FALSE", "Document verification status by staff"),
        ("verified_by", "UUID", "NULL", "-", "Staff user ID who verified the document"),
        ("verified_at", "TIMESTAMP WITH TZ", "NULL", "-", "Timestamp of staff verification"),
    ])

    # 4.5 permit_payments
    render_schema_table("permit_payments", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique payment record ID"),
        ("application_id", "UUID", "FOREIGN KEY, NOT NULL", "-", "FK to work_permit_applications(id)"),
        ("transaction_reference", "VARCHAR(150)", "UNIQUE, NOT NULL", "-", "Gateway transaction reference / PID"),
        ("payment_gateway", "ENUM", "NOT NULL", "-", "esewa | khalti | connect_ips | bank_transfer | cash"),
        ("amount_npr", "DECIMAL(10,2)", "NOT NULL", "-", "Amount paid in Nepalese Rupees"),
        ("status", "ENUM", "DEFAULT", "'pending'", "pending | completed | failed | refunded"),
        ("gateway_response", "JSONB", "NULL", "-", "Raw webhook / callback payload from payment gateway"),
        ("paid_at", "TIMESTAMP WITH TZ", "NULL", "-", "Confirmation timestamp"),
    ])

    # 4.6 permit_status_history
    render_schema_table("permit_status_history", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Audit log ID"),
        ("application_id", "UUID", "FOREIGN KEY, NOT NULL", "-", "FK to work_permit_applications(id) ON DELETE CASCADE"),
        ("previous_status", "VARCHAR(50)", "NULL", "-", "Status before change"),
        ("new_status", "VARCHAR(50)", "NOT NULL", "-", "Updated status"),
        ("remarks", "TEXT", "NULL", "-", "Operational note / reason for update"),
        ("changed_by_user_id", "UUID", "NULL", "-", "User/Admin ID who triggered the update"),
        ("changed_at", "TIMESTAMP WITH TZ", "DEFAULT", "CURRENT_TIMESTAMP", "Timestamp of state change"),
    ])

    # 5. SQL DDL
    add_custom_heading("5. Production SQL DDL Script (PostgreSQL)", level=1)
    
    sql_code = """-- Create Enums
CREATE TYPE permit_type_enum AS ENUM ('new_labour_permit', 'renewal_permit', 'individual_permit', 'legalization_attestation');
CREATE TYPE application_status_enum AS ENUM ('draft', 'submitted', 'document_verification', 'biometrics_scheduled', 'insurance_paid', 'feo_processing', 'approved', 'rejected', 'issued', 'cancelled');
CREATE TYPE document_type_enum AS ENUM ('passport_copy', 'arrival_stamp', 'visa_copy', 'agreement_paper', 'mrp_photo', 'experience_cert', 'police_clearance');
CREATE TYPE payment_gateway_enum AS ENUM ('esewa', 'khalti', 'connect_ips', 'bank_transfer', 'cash_counter');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Destination Countries
CREATE TABLE destination_countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code VARCHAR(50) UNIQUE NOT NULL,
    country_name VARCHAR(150) NOT NULL,
    iso_2 CHAR(2) NOT NULL,
    flag_code VARCHAR(10) NOT NULL,
    short_description VARCHAR(255),
    currency_code VARCHAR(10) DEFAULT 'NPR',
    processing_time_days VARCHAR(50) DEFAULT '2-3 Working Days',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fee Tiers
CREATE TABLE permit_fee_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    age_group_label VARCHAR(100) NOT NULL,
    min_age INT NOT NULL DEFAULT 18,
    max_age INT NOT NULL,
    welfare_fund_npr DECIMAL(10, 2) DEFAULT 1500.00,
    ssf_contribution_npr DECIMAL(10, 2) DEFAULT 2000.00,
    insurance_premium_npr DECIMAL(10, 2) NOT NULL,
    service_fee_npr DECIMAL(10, 2) DEFAULT 2500.00,
    total_cost_npr DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Applications
CREATE TABLE work_permit_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID,
    country_id UUID NOT NULL REFERENCES destination_countries(id),
    fee_tier_id UUID REFERENCES permit_fee_tiers(id),
    permit_type permit_type_enum NOT NULL DEFAULT 'new_labour_permit',
    applicant_full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    dob_ad DATE NOT NULL,
    dob_bs VARCHAR(20) NOT NULL,
    calculated_age INT NOT NULL,
    gender VARCHAR(20),
    passport_number VARCHAR(50),
    passport_expiry_date DATE,
    job_title VARCHAR(150),
    employer_company_name VARCHAR(255),
    company_changed BOOLEAN NOT NULL DEFAULT FALSE,
    previous_shram_number VARCHAR(100),
    status application_status_enum NOT NULL DEFAULT 'submitted',
    rejection_reason TEXT,
    admin_notes TEXT,
    feims_reference_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE permit_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES work_permit_applications(id) ON DELETE CASCADE,
    document_type document_type_enum NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE permit_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES work_permit_applications(id) ON DELETE CASCADE,
    transaction_reference VARCHAR(150) UNIQUE NOT NULL,
    payment_gateway payment_gateway_enum NOT NULL,
    amount_npr DECIMAL(10, 2) NOT NULL,
    status payment_status_enum NOT NULL DEFAULT 'pending',
    gateway_response JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit History
CREATE TABLE permit_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES work_permit_applications(id) ON DELETE CASCADE,
    previous_status application_status_enum,
    new_status application_status_enum NOT NULL,
    remarks TEXT,
    changed_by_user_id UUID,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_permit_app_phone ON work_permit_applications(phone_number);
CREATE INDEX idx_permit_app_status ON work_permit_applications(status);
CREATE INDEX idx_permit_app_country ON work_permit_applications(country_id);
CREATE INDEX idx_permit_docs_app ON permit_documents(application_id);
"""

    p_code = doc.add_paragraph()
    set_cell_background(table_p.cell(0,0), "2D1347") # dummy call to ensure styles
    p_code.paragraph_format.space_before = Pt(6)
    p_code.paragraph_format.space_after = Pt(6)
    run_code = p_code.add_run(sql_code)
    run_code.font.name = "Consolas"
    run_code.font.size = Pt(8)
    run_code.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # 6. REST API SPECIFICATIONS
    add_custom_heading("6. Backend REST API Endpoints Specification", level=1)
    
    api_table = doc.add_table(rows=7, cols=4)
    api_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    api_headers = ["Method", "Endpoint Path", "Request Body / Params", "Description & Response"]
    for i, h in enumerate(api_headers):
        cell = api_table.cell(0, i)
        cell.text = h
        set_cell_background(cell, "2D1347")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.name = "Arial"
            r.font.bold = True
            r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    api_rows = [
        ("GET", "/api/v1/work-permit/countries", "Query: active=true", "Returns list of all active destination countries and metadata."),
        ("GET", "/api/v1/work-permit/fee-calculator", "Query: dob_ad=YYYY-MM-DD", "Calculates age, determines fee tier, and returns itemized SSF/Insurance cost."),
        ("POST", "/api/v1/work-permit/apply", "Multipart/Form-data: Bio + Files", "Submits application, uploads documents to cloud, returns application_number."),
        ("GET", "/api/v1/work-permit/status/:appNumber", "Param: appNumber (or Phone)", "Fetches real-time status, timeline, documents, and approval stickers."),
        ("POST", "/api/v1/work-permit/payment/initiate", "JSON: { applicationId, gateway }", "Initializes eSewa/Khalti payment request and returns payment URL."),
        ("PATCH", "/api/v1/admin/work-permit/:id/status", "JSON: { status, remarks, feimsNo }", "Admin updates processing state, generates audit history entry."),
    ]

    for row_idx, data in enumerate(api_rows, start=1):
        for col_idx, text in enumerate(data):
            cell = api_table.cell(row_idx, col_idx)
            cell.text = text
            if row_idx % 2 == 1:
                set_cell_background(cell, "F8FAFC")
            p = cell.paragraphs[0]
            if col_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.name = "Arial"
                r.font.size = Pt(8.5)
                if col_idx == 0:
                    r.font.bold = True
                    if text == "GET":
                        r.font.color.rgb = RGBColor(0x02, 0x84, 0xC7)
                    elif text == "POST":
                        r.font.color.rgb = RGBColor(0x16, 0xA3, 0x4A)
                    elif text == "PATCH":
                        r.font.color.rgb = RGBColor(0xEA, 0x58, 0x0C)
                elif col_idx == 1:
                    r.font.name = "Consolas"
                    r.font.bold = True
                    r.font.size = Pt(8)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # 7. BACKEND VALIDATIONS
    add_custom_heading("7. Backend Validation Rules & Security", level=1)
    add_body_p(" Ensure dob_ad <= (Today - 18 Years). Reject applicants under legal employment age.", bold_prefix="1. Age Requirement: ")
    add_body_p(" Server-side validation using Bikram Sambat algorithm to ensure AD and BS dates match perfectly.", bold_prefix="2. Calendar Validation: ")
    add_body_p(" Enforce regex ^9[678][0-9]{8}$ for Nepali telecom operators (NTC/Ncell).", bold_prefix="3. Phone Validation: ")
    add_body_p(" Max 10MB per file; allow only PDF, JPG, JPEG, and PNG. Run magic-byte inspection on uploads.", bold_prefix="4. File Integrity: ")
    add_body_p(" Prevent direct access to passport and visa scans; generate short-lived AWS S3 Presigned URLs (15 min validity) for authorized staff only.", bold_prefix="5. Document Security: ")

    # Save
    output_path = "d:/THTT/THTT/THTT_Work_Permit_Database_Architecture.docx"
    doc.save(output_path)
    print(f"Successfully generated Word document at: {output_path}")

if __name__ == "__main__":
    create_work_permit_doc()
