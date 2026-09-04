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

def create_packages_doc():
    doc = Document()

    # Set page margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = p_title.add_run("THTT - Tours, Trekking & Adventure Packages\nDatabase Architecture & Relationship Guide")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(20)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x2D, 0x13, 0x47)

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sub = p_sub.add_run("Complete Database Design, Entity Relationships, Working Flow & Backend Specifications\nTrip Himalaya Tours & Travels (THTT)")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

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

    # 1. DOMAIN OVERVIEW
    add_custom_heading("1. Domain Overview & Taxonomy", level=1)
    add_body_p("In the THTT platform, all travel offerings—whether cultural tours, Himalayan high-altitude treks, extreme adventure activities, or multi-day combo packages—are managed under a unified, extensible Package domain model.")
    
    add_body_p(" (1) Tour (cultural, sightseeing, city), (2) Trek (EBC, Annapurna, Langtang), (3) Activity (Paragliding, Bungee, Rafting, Zipflyer, Kayaking), (4) Combo (Multi-adventure bundles e.g. Pokhara Ultimate Combo).", bold_prefix="• Package Types (type): ")
    add_body_p(" Domestic (Within Nepal) vs. International (e.g. Bali, Dubai, Thailand).", bold_prefix="• Geographic Scope (category): ")
    add_body_p(" Easy, Moderate, Hard, Extreme.", bold_prefix="• Difficulty Levels (difficulty): ")
    add_body_p(" Air (Paragliding, Zipflyer), Water (Rafting, Kayaking), Land (Bungee, Biking, Trekking, Rock Climbing).", bold_prefix="• Adventure Class (adventureCategory): ")
    add_body_p(" Dual-mode currency support where packages store base prices with dynamic NPR (Nepalese Rupee) and USD (US Dollar) conversion tables and guest count multipliers.", bold_prefix="• Currency & Pricing: ")

    # 2. DETAILED EXPLANATION OF RELATIONSHIPS
    add_custom_heading("2. Understanding the Entity Relationships", level=1)
    add_body_p("To build a scalable and modular backend, the package schema is normalized into a central parent entity and 10 related satellite entities:")

    rel_table = doc.add_table(rows=11, cols=3)
    rel_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    r_headers = ["Relationship", "Connected Tables", "Why It Exists & How It Works in THTT"]
    for i, h in enumerate(r_headers):
        cell = rel_table.cell(0, i)
        cell.text = h
        set_cell_background(cell, "2D1347")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.name = "Arial"
            r.font.bold = True
            r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    relations_data = [
        ("1 : N (One-to-Many)", "packages -> package_highlights", "Stores 3-5 key selling points (e.g. 'Lukla Flight', 'Phewa Lake View'). Displayed on listing cards and used by search filters."),
        ("1 : N (One-to-Many)", "packages -> package_gallery", "Stores all high-resolution photos for the interactive 5-image masonry grid on the detail page."),
        ("1 : N (One-to-Many)", "packages -> package_itineraries", "Maintains chronological day-by-day schedule ('Day 01: Arrival', 'Day 02: Trek to Namche'). Rendered in the Timeline roadmap."),
        ("1 : N (One-to-Many)", "packages -> package_inclusions", "Explicit list of included services (Guide, Permits, Breakfast, Transfers). Rendered under Overview and Policies."),
        ("1 : N (One-to-Many)", "packages -> package_exclusions", "Explicit list of excluded items (Visa fee, Travel insurance, Personal gear, Tips). Prevents customer disputes."),
        ("1 : N (One-to-Many)", "packages -> package_restrictions", "Defines mandatory safety/medical limits (e.g. 'Max weight 110kg', 'Min age 12 yrs'). Displayed in the Policies tab."),
        ("1 : N (One-to-Many)", "packages -> package_what_to_bring", "Pre-trip preparation packing checklist (e.g. 'Hiking boots', 'Windproof jacket', 'Sunscreen')."),
        ("1 : N (One-to-Many)", "packages -> package_faqs", "Accordion Q&A specific to that trek/adventure (e.g. 'Best season to visit', 'Fitness requirement')."),
        ("1 : N (One-to-Many)", "packages -> package_pricing_tiers", "Multi-tier pricing matrix (Adult, Child, Heli Return Add-on) storing separate raw NPR and USD prices."),
        ("1 : N (One-to-Many)", "packages -> package_testimonies", "Verified customer reviews, star ratings, and comments. Calculates aggregate average rating (e.g. 4.8 / 5.0)."),
    ]

    for row_idx, (rel, tables, desc) in enumerate(relations_data, start=1):
        cell_rel = rel_table.cell(row_idx, 0)
        cell_rel.text = rel
        cell_tbl = rel_table.cell(row_idx, 1)
        cell_tbl.text = tables
        cell_dsc = rel_table.cell(row_idx, 2)
        cell_dsc.text = desc

        if row_idx % 2 == 1:
            set_cell_background(cell_rel, "F8FAFC")
            set_cell_background(cell_tbl, "F8FAFC")
            set_cell_background(cell_dsc, "F8FAFC")

        for c_idx in range(3):
            cell = rel_table.cell(row_idx, c_idx)
            for p in cell.paragraphs:
                for r in p.runs:
                    r.font.name = "Arial"
                    r.font.size = Pt(8.5)
                    if c_idx == 0:
                        r.font.bold = True
                        r.font.color.rgb = RGBColor(0xD9, 0x26, 0x71)
                    elif c_idx == 1:
                        r.font.bold = True
                        r.font.color.rgb = RGBColor(0x2D, 0x13, 0x47)
                    else:
                        r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # 3. DATA DICTIONARY
    add_custom_heading("3. Comprehensive Data Dictionary (11 Tables)", level=1)

    def render_dict_table(table_name, columns):
        add_custom_heading(f"Table: {table_name}", level=2)
        tbl = doc.add_table(rows=len(columns)+1, cols=5)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
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

    # 3.1 packages
    render_dict_table("packages", [
        ("id", "VARCHAR(50)", "PRIMARY KEY", "-", "Unique package ID e.g. 'p1' (Trek), 'a1' (Activity), 'c1' (Combo)"),
        ("title", "VARCHAR(255)", "NOT NULL", "-", "Display title e.g. 'Everest Base Camp Trek'"),
        ("slug", "VARCHAR(255)", "UNIQUE, NOT NULL", "-", "SEO URL slug e.g. 'ebc-trek'"),
        ("duration", "VARCHAR(100)", "NOT NULL", "-", "Duration string e.g. '14 Days', '30-45 Mins', '3-5 Hours'"),
        ("price", "VARCHAR(50)", "NOT NULL", "-", "Base USD starting price formatted string e.g. '$1,299', '$85'"),
        ("image", "TEXT", "NOT NULL", "-", "Primary high-resolution card cover image URL"),
        ("category", "ENUM", "NOT NULL", "'domestic'", "Scope: 'domestic' | 'international'"),
        ("type", "ENUM", "NOT NULL", "'tour'", "Main type: 'tour' | 'trek' | 'activity' | 'combo'"),
        ("is_featured", "BOOLEAN", "NOT NULL", "FALSE", "Flags package for Home Page 'Hot Deals' and 'Adventure Calls'"),
        ("difficulty", "ENUM", "NULL", "-", "'Easy' | 'Moderate' | 'Hard' | 'Extreme'"),
        ("adventure_category", "ENUM", "NULL", "-", "'Air' | 'Water' | 'Land'"),
        ("intensity", "VARCHAR(100)", "NULL", "-", "Vibe tag e.g. 'High Thrill', 'Maximum Adrenaline', 'Epic Adventure'"),
        ("description", "TEXT", "NULL", "-", "Full multi-paragraph overview and background story"),
        ("location", "VARCHAR(255)", "NULL", "-", "Destination location e.g. 'Solukhumbu, Nepal', 'Pokhara, Nepal'"),
        ("rating", "DECIMAL(2,1)", "DEFAULT", "5.0", "Calculated average review score (e.g. 4.8)"),
        ("reviews_count", "INTEGER", "DEFAULT", "0", "Total count of approved customer testimonies"),
        ("created_at", "TIMESTAMP WITH TZ", "DEFAULT", "CURRENT_TIMESTAMP", "Record creation timestamp"),
        ("updated_at", "TIMESTAMP WITH TZ", "DEFAULT", "CURRENT_TIMESTAMP", "Record update timestamp"),
    ])

    # 3.2 package_highlights
    render_dict_table("package_highlights", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique highlight ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("highlight", "VARCHAR(255)", "NOT NULL", "-", "Key highlight point e.g. 'Lukla Flight', 'Phewa Lake View'"),
        ("display_order", "INT", "DEFAULT", "0", "Display order on card and details overview"),
    ])

    # 3.3 package_gallery
    render_dict_table("package_gallery", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique gallery image ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("image_url", "TEXT", "NOT NULL", "-", "High-resolution photo URL for masonry grid"),
        ("display_order", "INT", "DEFAULT", "0", "Sorting order in photo grid"),
    ])

    # 3.4 package_itineraries
    render_dict_table("package_itineraries", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique itinerary step ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("day", "VARCHAR(20)", "NOT NULL", "-", "Day identifier e.g. '01', 'Day 1'"),
        ("title", "VARCHAR(255)", "NOT NULL", "-", "Stage title e.g. 'Fly to Lukla & Trek to Phakding'"),
        ("description", "TEXT", "NOT NULL", "-", "Detailed day-by-day briefing and milestones"),
        ("display_order", "INT", "NOT NULL", "1", "Chronological sequence index"),
    ])

    # 3.5 package_inclusions & exclusions
    render_dict_table("package_inclusions", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique inclusion ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("item", "TEXT", "NOT NULL", "-", "Included feature e.g. 'Airport pickups in private vehicle'"),
        ("display_order", "INT", "DEFAULT", "0", "Sorting order"),
    ])

    render_dict_table("package_exclusions", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique exclusion ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("item", "TEXT", "NOT NULL", "-", "Excluded feature e.g. 'Personal trekking gear & insurance'"),
        ("display_order", "INT", "DEFAULT", "0", "Sorting order"),
    ])

    # 3.6 package_restrictions & what_to_bring
    render_dict_table("package_restrictions", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique restriction ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("restriction", "TEXT", "NOT NULL", "-", "Safety rule e.g. 'Max weight: 110 kg', 'Min age: 12'"),
    ])

    render_dict_table("package_what_to_bring", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique gear checklist ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("item", "VARCHAR(255)", "NOT NULL", "-", "Gear item e.g. 'Warm Down Jacket', 'Sturdy Shoes'"),
    ])

    # 3.7 package_faqs
    render_dict_table("package_faqs", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique FAQ ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("question", "TEXT", "NOT NULL", "-", "Customer question e.g. 'What is the best time to trek?'"),
        ("answer", "TEXT", "NOT NULL", "-", "Comprehensive answer explaining seasons/fitness"),
        ("display_order", "INT", "DEFAULT", "0", "Accordion display sequence"),
    ])

    # 3.8 package_pricing_tiers
    render_dict_table("package_pricing_tiers", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique pricing tier ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("service", "VARCHAR(255)", "NOT NULL", "-", "Option name e.g. 'Full EBC Trek Package', 'Heli Return Add-on'"),
        ("age_group", "VARCHAR(100)", "NOT NULL", "-", "Target age tier e.g. 'Adult', 'Child', 'All'"),
        ("price_npr", "DECIMAL(12,2)", "NOT NULL", "-", "Raw numeric price in Nepalese Rupees (e.g. 120000.00)"),
        ("price_usd", "DECIMAL(10,2)", "NOT NULL", "-", "Raw numeric price in US Dollars (e.g. 1299.00)"),
    ])

    # 3.9 package_testimonies
    render_dict_table("package_testimonies", [
        ("id", "VARCHAR(50)", "PRIMARY KEY", "-", "Unique review ID e.g. 'rev1', 'at1'"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id) ON DELETE CASCADE"),
        ("user_name", "VARCHAR(150)", "NOT NULL", "-", "Customer full name e.g. 'Mark Wilson'"),
        ("user_avatar", "TEXT", "NULL", "-", "Customer profile picture URL"),
        ("rating", "SMALLINT", "CHECK (1..5)", "-", "Star rating (1 to 5)"),
        ("comment", "TEXT", "NOT NULL", "-", "Customer testimony feedback"),
        ("date", "DATE", "NOT NULL", "-", "Review submission date"),
        ("location", "VARCHAR(150)", "NULL", "-", "Customer origin e.g. 'Sydney, Australia', 'USA'"),
    ])

    # 3.10 package_inquiries_and_bookings
    render_dict_table("package_inquiries_and_bookings", [
        ("id", "UUID", "PRIMARY KEY", "gen_random_uuid()", "Unique lead/booking ID"),
        ("package_id", "VARCHAR(50)", "FOREIGN KEY, NOT NULL", "-", "FK to packages(id)"),
        ("customer_name", "VARCHAR(150)", "NULL", "-", "Customer name"),
        ("customer_phone", "VARCHAR(50)", "NULL", "-", "Customer contact number"),
        ("number_of_guests", "INT", "DEFAULT", "1", "Number of travelers selected"),
        ("currency_used", "ENUM", "DEFAULT", "'foreigner'", "'nepali' (NPR) | 'foreigner' (USD)"),
        ("estimated_total", "DECIMAL(12,2)", "NULL", "-", "Calculated estimate (Guests x Price Tier)"),
        ("inquiry_channel", "VARCHAR(50)", "DEFAULT", "'whatsapp'", "'whatsapp' | 'online_booking'"),
        ("status", "VARCHAR(50)", "DEFAULT", "'inquired'", "'inquired' | 'confirmed' | 'cancelled'"),
        ("created_at", "TIMESTAMP WITH TZ", "DEFAULT", "CURRENT_TIMESTAMP", "Submission timestamp"),
    ])

    # 4. SQL SCRIPT
    add_custom_heading("4. Production SQL DDL Script (PostgreSQL)", level=1)
    sql_script = """-- 1. ENUMS
CREATE TYPE package_category_enum AS ENUM ('domestic', 'international');
CREATE TYPE package_type_enum AS ENUM ('tour', 'trek', 'activity', 'combo');
CREATE TYPE difficulty_level_enum AS ENUM ('Easy', 'Moderate', 'Hard', 'Extreme');
CREATE TYPE adventure_category_enum AS ENUM ('Air', 'Water', 'Land');
CREATE TYPE currency_mode_enum AS ENUM ('nepali', 'foreigner');

-- 2. PACKAGES
CREATE TABLE packages (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    category package_category_enum NOT NULL DEFAULT 'domestic',
    type package_type_enum NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty difficulty_level_enum,
    adventure_category adventure_category_enum,
    intensity VARCHAR(100),
    description TEXT,
    location VARCHAR(255),
    rating DECIMAL(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. HIGHLIGHTS
CREATE TABLE package_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    highlight VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0
);

-- 4. GALLERY
CREATE TABLE package_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- 5. ITINERARY
CREATE TABLE package_itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    day VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 1
);

-- 6. INCLUSIONS & EXCLUSIONS
CREATE TABLE package_inclusions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE package_exclusions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- 7. RESTRICTIONS & WHAT TO BRING
CREATE TABLE package_restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    restriction TEXT NOT NULL
);

CREATE TABLE package_what_to_bring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    item VARCHAR(255) NOT NULL
);

-- 8. FAQS
CREATE TABLE package_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0
);

-- 9. PRICING TIERS
CREATE TABLE package_pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    service VARCHAR(255) NOT NULL,
    age_group VARCHAR(100) NOT NULL,
    price_npr DECIMAL(12, 2) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL
);

-- 10. REVIEWS / TESTIMONIES
CREATE TABLE package_testimonies (
    id VARCHAR(50) PRIMARY KEY,
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    user_name VARCHAR(150) NOT NULL,
    user_avatar TEXT,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(150)
);

-- 11. INQUIRIES & BOOKINGS
CREATE TABLE package_inquiries_and_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id VARCHAR(50) NOT NULL REFERENCES packages(id),
    customer_name VARCHAR(150),
    customer_phone VARCHAR(50),
    number_of_guests INT NOT NULL DEFAULT 1,
    currency_used currency_mode_enum NOT NULL DEFAULT 'foreigner',
    estimated_total DECIMAL(12, 2),
    inquiry_channel VARCHAR(50) DEFAULT 'whatsapp',
    status VARCHAR(50) DEFAULT 'inquired',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PERFORMANCE INDEXES
CREATE INDEX idx_packages_type ON packages(type);
CREATE INDEX idx_packages_category ON packages(category);
CREATE INDEX idx_packages_is_featured ON packages(is_featured);
CREATE INDEX idx_package_itinerary_pkg ON package_itineraries(package_id);
CREATE INDEX idx_package_pricing_pkg ON package_pricing_tiers(package_id);
"""
    p_code = doc.add_paragraph()
    p_code.paragraph_format.space_before = Pt(6)
    p_code.paragraph_format.space_after = Pt(6)
    r_code = p_code.add_run(sql_script)
    r_code.font.name = "Consolas"
    r_code.font.size = Pt(8)
    r_code.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    # 5. WORKING FLOW & API
    add_custom_heading("5. Working Flow & Lifecycle in THTT", level=1)
    add_body_p(" Query parameters: ?type=tour|trek|activity&category=domestic|international&priceRange=5000&rating=4&keyword=EVEREST. The backend filters against packages and package_highlights.", bold_prefix="1. Catalog Search & Filter: ")
    add_body_p(" Frontend fetches package metadata along with eager-loaded package_gallery and package_pricing_tiers.", bold_prefix="2. Detail Page Loading: ")
    add_body_p(" Sub-routes load respective child collections: Overview (Highlights + Timeline), /policies (Inclusions + Exclusions + Restrictions + What to Bring), /faqs (FAQs), /testimonies (Reviews).", bold_prefix="3. Sub-route Navigation: ")
    add_body_p(" Switching between NPR and USD updates pricing cards and calculates (Guest Count x Tier Price).", bold_prefix="4. Dynamic Pricing Calculation: ")
    add_body_p(" Clicking 'Inquire Now' opens WhatsApp with pre-filled package details and logs a lead record in package_inquiries_and_bookings.", bold_prefix="5. Inquiry & Conversion: ")

    output_path = "d:/THTT/THTT/THTT_Packages_Tours_Treks_Database_Architecture.docx"
    doc.save(output_path)
    print(f"Successfully generated packages Word doc at: {output_path}")

if __name__ == "__main__":
    create_packages_doc()
