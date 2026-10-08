const SUPABASE_URL = "https://xzwwceoexdnarlcxbqbh.supabase.co";
const SUPABASE_KEY = "sb_publishable_j5BXr-16DXeukNiSK9SKhA_Fm0v8UdL";

const FOOD_SAFETY_TITLES = {};
const FOOD_SAFETY_DETAILS = {};
const RSA_ASSESSMENT_DETAILS = {};
const FOH_DETAILS = {
  "Utilizes CORE 4": "Create eye contact, greet with a smile, use a friendly tone, and always say “my pleasure.”",
  "Starts with a Warm Welcome and ends with a Fond Farewell": "",
  "Has basic understanding of POS system": "",
  "Understands and follows basic order structure": "Understand the difference between necessary and unnecessary questions. Necessary: if a guest orders a number 1, ask “Would you like that regular or deluxe?” Avoid unnecessary questions such as asking about cherry and whipped cream on a milkshake, pickles on a sandwich, or which cheese comes on a spicy deluxe.",
  "Basic understanding of the menu and possible customizations": "",
  "Gets guest’s name and uses it at least twice": "",
  "Reads back order": "",
  "Understands how to scan and utilize CFA app features on the POS": "",
  "Tenders order properly": "",
  "Prepares beverage correctly and hands to guest": "Push the correct dimples on the lid. Keep the cup and lid clean and dry, and hand a straw to the guest.",
  "Understands preparation of milkshakes, frosted beverages, iced coffees, and Icedream options": "Make these when the guest orders dessert, when applicable.",
  "Understands the second-mile service portion of Winning Hearts Everyday": "Be Personal, Be Proactive, Be Generous.",
  "Understands Attentive and Courteous metric and works accordingly": "",
  "Executes FOH awareness": "Acknowledge waiting guests; monitor the mobile and third-party beverage screen; sauce bags and run food when there are no guests in line; stock and clean when no guests are waiting.",
  "Changes shake base properly": "",
  "Properly brews and prepares tea": "",
  "Properly prepares regular and diet lemonade with labels": "",
  "Properly changes strawberry shooter tool": "",
  "Properly prepares iced coffee base": "",
  "Understands when and how to refill the Icedream machine": "",
  "Understands the process of Prep Tray rotation": "",
  "Basic understanding of applicable food safety principles": "",
  "Knows how to utilize label maker and does so properly": "",
  "Proficient in all other FOH tasks and positions": "",
  "Understands what goes where in the warmer chutes": "",
  "Understands bagging process for fries": "Bag fries last and understand the hold time. Secure fries upright with other items; do not place sauces on top.",
  "Bags all food items with reasonable speed and excellent accuracy": "",
  "Understands what bags to use and when": "",
  "Proficient communication with the BOH team": "",
  "Basic understanding of the bagging matrix and dine-ready meals": "",
  "Understands Prep Kanban system": "",
  "Understands the KPS and bump bar system": "",
  "Proficient communication with the saucer/stuffer position when applicable": "",
  "Utilizes CORE 4 when handing out food to guests": "",
  "Awareness of mobile and third-party beverage screen and prepares items when applicable": "",
  "Sanitizes the chutes and other food prep surfaces every 4 hours": "",
  "Keeps area stocked and cleaned": "",
  "All soda towers are disassembled and turned off": "Place nozzles in K5; clean all parts and return them to the correct location.",
  "Soda tower catch trays are clean and free of debris/residue": "",
  "Lemonade dispensers are broken down and taken to dish": "Clean underneath the tea urn stand and lemonade stand so they are free of debris/residue.",
  "Tea urns are emptied, taken to dish, thoroughly cleaned, and returned": "",
  "Tea nozzles are disassembled and placed in K5 sanitizer": "",
  "Icedream machine is off and thoroughly cleaned and sanitized": "Include the sides, back, and wall.",
  "Icedream parts have been completely disassembled and taken to dish to be washed": "",
  "All Icedream parts are clean, free of lubricant residue, and returned to the correct location": "",
  "Excess Icedream is placed in the walk-in with a label or disposed of Wednesday/Saturday": "",
  "All necessary dessert toppings are stored in the lowboy with correct labels": "",
  "Shake base machine is clean and stocked with labels": "",
  "Shake base tray and catch pan are taken to dish and returned to the correct location": "",
  "Chutes have been cleaned and sanitized": "Take out and clean dividers. Remove front guards and clean underneath. Leave the surrounding counter clean and free of debris.",
  "Lowboy fridge is cleaned and polished": "Include the top, interior, and gaskets.",
  "Sauce wall is stocked and surrounding countertop is clean": "",
  "Tea brewer parts are emptied, cleaned, and returned to the correct location": "",
  "Dry storage items are stocked and organized appropriately": "",
  "All countertops are cleaned and sanitized with no residue": "",
  "Line stanchions are separated and stowed away": "",
  "Floor is swept, scrubbed, squeegeed, and mopped": "Include behind the Icedream machine and underneath the sugar bin and lowboy.",
  "FOH closet floor is swept underneath shelving": "",
  "Regular Chicken Sandwich": "Chick-fil-A Regular Chicken Sandwich\n– Internal Temperature\n• Filet temp ≥ 140°F\n– Packaging Cleanliness\n• No stains, smudges, or residue larger than a nickel\n– Packaging\n• Correct foil bag\n• Folded to approximately 2½ inches\n– White Bun Quality\n• Not torn\n• Not crushed\n• No flaking or peeling\n– Butter Coverage\n• Crown evenly buttered\n• Heel evenly buttered\n– Crown Toasting\n• Evenly toasted\n• Correct golden-brown color\n• No burnt or under-toasted areas\n– Filet Bun Coverage\n• Acceptable bun coverage\n– Filet Appearance\n• Golden brown\n• Most attractive side facing up\n– Breading Coverage\n• Bare spots total no larger than a quarter\n– Coater Coverage\n• Fully coated with seasoned coater\n• Generous, even coverage\n• No large lumps\n– Filet Weight\n• 3.3 oz or greater\n– Pickle Placement\n• 2 whole pickle chips\n• 3 pickle chips if less than 1.25 inch diameter\n• Spread out in center of bun heel\n– Heel Toasting\n• Evenly toasted\n• Correct golden-brown color\n• No burnt or under-toasted areas\n– Taste & Texture\n• Sweet and salty taste\n• Juicy, tender filet\n• Crisp coating\n• Fresh, soft bun",
  "Grilled Chicken Sandwich": "Chick-fil-A Grilled Chicken Sandwich – QUIV Index Card\n04.01.01 – Clamshell Packaging\n• Both locking tabs secured\n• Product not protruding\n04.01.02 – Clamshell Cleanliness\n• Outside clean\n• Stains no larger than a quarter\n04.01.03 – Internal Temperature\n• Grilled filet temp ≥ 140°F\n04.01.04 – Ingredient Order\n• Ingredients layered in correct order\n04.01.05 – Packaging\n• Correct clamshell\n• Correct sleeve\n04.01.06 – Bun Quality\n• Not torn\n• Not crushed\n• No flaking\n• No peeling\n04.01.07 – Crown Toasting\n• Evenly toasted\n• Correct color\n04.01.08 – Grilled Filet Appearance\n• Correct color\n• Best grill marks facing up\n04.01.09 – Carbon Build-Up\n• No carbon build-up on either side\n04.01.10 – Grilled Filet Weight\n• Weight ≥ 2.7 oz\n04.01.11 – Tomatoes\n• 2 tomato slices present\n04.01.12 – Green Leaf Lettuce\n• 2 pieces Green Leaf lettuce present\n04.01.13 – Bun Coverage\n• Acceptable bun coverage\n• Filet centered\n04.01.14 – Heel Toasting\n• Evenly toasted\n• Correct color\n04.01.15 – Honey Roasted BBQ\n• 1 Honey Roasted BBQ packet served\n04.01.16 – Taste & Texture\n• Juicy, tender filet\n• Proper grilled flavor\n• Fresh vegetables\n• Fresh bun\n• Meets taste and texture standards\nQuick Memory Version:\n140°F • Closed Clamshell • Stains ≤ Quarter • Correct Build • Correct Sleeve • Good Bun • Crown Toasted • Best Grill Marks Up • No Carbon • ≥ 2.7 oz • 2 Tomatoes • 2 Lettuce • Good Bun Coverage • Heel Toasted • 1 HRBBQ Packet • Juicy & Tender",
  "8-Count Regular Nuggets": "Chick-fil-A 8 Count Nugget\n– Internal Temperature\n• Nuggets internal temperature ≥ 140°F\n02.01.02 – Packaging & Presentation\n• Correct container\n• Properly closed\n• Nugget tab\n– Packaging Cleanliness\n• No stains, smudges, or residue larger than a nickel\n– Packaged Weight\n• Packaged 8-count nuggets weigh ≥ 4.2 oz\n– Nugget Count\n• 8 nuggets in the box\n– Nugget Box Cleanliness\n• No scraps in the nugget box\n– Nugget Color\n• Golden brown appearance\n• Consistent color\n• Meets quality photo standards\n– Coater Coverage\n• Fully coated with seasoned coater\n• Generous, even coating\n• No large lumps\n• No uncooked coater\n– Bare Spot Coverage\n• Bare spots collectively no larger than a dime\n– Taste & Texture\n• Signature Chick-fil-A flavor\n• Sweet and salty taste\n• Tender, juicy chicken\n• Crisp coating",
  "5-Count Grilled Nuggets": "Chick-fil-A 5-Count Grilled Nuggets – QUIV Index Card\n01.06.01 – Packaging & Presentation\n• Correct container\n• Properly closed\n• Presented correctly\n01.06.02 – Packaged Weight\n• Weight ≥ 2.0 oz\n01.06.03 – Internal Temperature\n• Grilled Nuggets ≥ 140°F\n01.06.04 – Nugget Count\n• 5 Grilled Nuggets in bowl\n01.06.05 – Color & Grill Marks\n• Correct color\n• Best grill marks visible\n01.06.06 – Taste & Texture\n• Tender and juicy\n• Proper grilled flavor\n• Meets taste and texture standards\nQuick Memory Version:\nCorrect Bowl • ≥ 2.0 oz • ≥ 140°F • 5 Nuggets • Correct Color • Best Grill Marks Visible • Tender & Juicy • Proper Grilled Flavor",
  "Waffle Fries": "Chick-fil-A Waffle Potato Fries – QUIV Index Card\n03.01.01 – Internal Temperature\n• Temp 3 fries\n• All 3 fries ≥ 170°F\n03.01.02 – Package Fill Level\n• Package appears full\n• No visible underfilling\n03.01.03 – Packaging Cleanliness\n• Carton clean\n• Stains/smudges collectively ≤ nickel size\n• Check all sides and bottom\n03.01.04 – Medium Fry Weight\n• Packaged weight between 4.2 oz and 5.2 oz\n03.01.05 – Fry Texture & Cook Quality\n• Evenly cooked\n• Crisp on outside\n• Soft on inside\n• Not scorched\n• Not soggy\n03.01.06 – Fry Separation\n• No excessive clumping\n• No 3 or more fries stuck together\n03.01.07 – Fry Color\n• Golden brown\n• Consistent color\n• Meets quality photo standards\n03.01.08 – Taste & Texture\n• Proper potato flavor\n• Lightly salted\n• Crisp outside\n• Soft and fluffy inside\n• Meets taste and texture standards\n03.01.09 – Small Pieces\n• No excessive number of small pieces\n• Mostly full-size fries\nQuick Memory Version:\n170°F (3 Fries) • Full Carton • Clean Carton ≤ Nickel • 4.2–5.2 oz • Crisp Outside/Soft Inside • No 3+ Clumps • Golden Brown • Lightly Salted • Proper Potato Flavor • No Excessive Small Pieces",
  "Food Safety Pathway has been completed": "",
  "Demonstrates proper handwashing": "Demonstrate the handwashing procedure taught in Pathway and explain when hands must be washed.",
  "All required components of uniform are present and in good condition": "This includes correct belt, shirt, pants, non-slip shoes, name tag, hair restraints if applicable, and hairnet.",
  "Explains the Food Safety Five principles": "Cross Contamination, Pests Elimination, Time and Temperature, Health and Hygiene, Cleaning and Sanitation",
  "Team member understands proper use of gloves and aprons": "Include when to change gloves, specifically noting that touching the face, phone, or anything that is not food safe requires changing gloves.",
  "Understands basic use of all chemicals and where chemicals are to remain located": "Degreaser, Super Contact Cleaner, Sizzle Spray, Multi Surface, Sanitizer (wipes and spray), Release Agent, Drain Cleaner",
  "Health & Hygiene Part 1": "Health & Hygiene Part 1 — Assessment Checks\nSDC.410 — Restaurant health policy (HIGH)\n• SDC.410.a: Maintain a written or digital health policy.\n• SDC.410.b: Address both foodborne illness and severe respiratory illness. The policy should meet ORG and FDA Food Code requirements.\nSDC.413 — Leader knowledge (MEDIUM)\n• SDC.413.a: Ask the person in charge to identify reportable foodborne diagnoses requiring exclusion.\n• SDC.413.b: Ask for a symptom that requires sending someone home or excluding them. Consider checking additional Team Members' knowledge.\nSDC.701 — Pre-work screening (HIGH)\n• Screen Team Members for illness before work using the Operator's chosen method.\nSDC.409 — Excluding illness (IMMEDIATE)\n• SDC.409.a: Watch for vomiting, diarrhea, yellow skin/eyes, fever, sore throat with fever, pus-filled lesions, open/draining infected wounds or burns, sudden loss of taste/smell, or sudden shortness of breath.\n• SDC.409.b: Follow the restaurant policy to exclude diagnosed illness. The assessment lists Norovirus, Hepatitis A, Shigella, Salmonella, E. coli, COVID-19, and influenza, along with other physician-diagnosed illnesses covered by the policy.\nSDC.419 — Fingernails (MEDIUM)\n• SDC.419.a: Nails must be clean and trimmed; they must not extend beyond the fingertips when viewed from the palm side.\n• SDC.419.b: False nails are prohibited.\n• SDC.419.d: Nail gems are prohibited.\n• SDC.419.f: Wear gloves over nail polish while handling food or working in BOH food-preparation areas.\nSDC.425 — Hair restraints and jewelry (LOW)\n• SDC.425.a: Facial hair longer than ¼ inch requires a beard net in food preparation and food-service roles requiring gloves.\n• SDC.425.b: Restrain loose hair effectively. Tie back hair around the face; accessories must not have loose beads or jewels that could fall into food.\n• SDC.425.c: Do not wear watches, bracelets, or wrist braces in food-preparation areas. A medical-alert bracelet may be kept in a pocket.\n• SDC.425.d: Rings are limited to a plain, stone-free band. Cover a ring with food-service gloves in preparation areas.\nSDC.403 — Raw-chicken apron (HIGH)\n• SDC.403.a: Wear a yellow apron when handling raw chicken.\nSDC.411 — Operator certification (MEDIUM)\n• Post the Operator's current ServSafe certificate. Verify the printed date; the assessment uses a 5-year validity period.\nSDC.801 — Puerto Rico only (MEDIUM)\n• Keep Operator and Team Member physician-issued health certificates on file and current within 1 year. This regional requirement does not apply to Haywood Mall.\nQuestion wording varies: some ask whether the correct practice occurs, while others ask whether a prohibited condition exists.",
  "Cleaning & Sanitation Part 1": "Cleaning & Sanitation Part 1 — Assessment Checks\nCompartment sink\n• SDC.351.c (MEDIUM): Keep the sink and its parts clean, intact, and secure. Clean and sanitize between raw and ready-to-eat dishes.\n• SDC.327.a (MEDIUM): The spray hose must not drop below the sink rim.\n• SDC.327.b (MEDIUM): Maintain an air gap between the waste pipe and floor drain.\n• SDC.351.d (MEDIUM): Wash raw dishes at a different time from ready-to-eat dishes; use Not Observable when no washing is occurring.\n• SDC.351.e (MEDIUM): Do not thaw food while washing or storing dishes in the sink.\nSDC.301 — Food-safe materials (MEDIUM)\n• Food-contact equipment must be durable, non-toxic, and suitable for food. Check modified, home-supplied, or outside-purchased tools and improper repurposing such as a pickle bucket used for ice. Refer uncertain items to leadership.\nSDC.329 — Food-contact condition (MEDIUM)\n• Inspect for damage, roughness, and surfaces that cannot be cleaned: filet rollers;   cutting boards; ice buckets, paddles, and scoops; fry skimmers; fryer baskets;  breading sifters/nugget baskets; fry scoops; and lettuce choppers.\n• Look for chips, fraying, cracks, deep grooves, dents, holes, and rough welds. Note other damaged food-contact equipment as well.\nSDC.303 — Cleaning and sanitizing food-contact items (IMMEDIATE)\n• Stored-clean items must be clean and sanitized. During continuous room-temperature use, clean and sanitize at least every 4 hours.\n• Check chicken slicers, cutting boards, egg slicers, pans/kanbans, filet rollers, and knives.\n• This particular 4-hour check does not apply to chicken kanbans currently held in hot holding.\n• Sanitize thermometer probes before use; check other food-contact items too.\nSDC.337 — Clean-item storage (LOW)\n• Store clean equipment, utensils, and packaging hygienically. Invert stacked items so dust/debris cannot collect inside. Keep trash bags and dirty items from touching clean supplies, including catering trays and packaging at Boards, Prep, and Dry Storage.\nSDC.311 — Ice and beverage equipment (MEDIUM)\n• Inspect and sanitize ice-machine interiors, ice bins, and beverage nozzles.\n• Use a flashlight. Wipe suspicious discoloration to check for removable buildup. Remove 3 soda nozzles/diffusers and inspect them plus the valve area above.\nOther storage and facility checks\n• SDC.339 (LOW): Handle and store utensils hygienically while they are in use.\n• SDC.341 (LOW): Clean equipment surfaces that do not directly touch food.\n• SDC.343 (LOW): Keep handles, pan exteriors, shelves, gaskets, lids, and other non-food-contact surfaces durable, safe, and intact; check cracked lemonade/ice-cream lids.\n• SDC.355 (LOW): Keep restrooms stocked, clean, and repaired.\n• SDC.361 (LOW): Inspect floors/grout, baseboards, walls, doors/windows, and ceilings. Surfaces must be intact, smooth, and cleanable, without excessive dust/debris; prevent standing water on floors.\n• SDC.363 (LOW): Keep vents, fan guards, filters, and exhaust hoods clean and undamaged.\n• SDC.367 (LOW): Provide adequate light and shielded or shatter-resistant bulbs above exposed food, food-contact surfaces, and packaging. Remove debris/dead insects from fixtures.\n• SDC.369 (LOW): Empty and clean interior trash cans. Use intact, watertight, leak-proof, rodent-resistant containers; do not substitute cardboard boxes or permit overflow.\nRead the question wording before answering; some ask whether an unsafe condition exists.",
  "Cross-contamination Part 1": "Cross-contamination Part 1 — Assessment Checks\nSDC.201 — Protecting food and food-contact surfaces (LOW)\n• SDC.201.a: Keep stored food covered. Food may be uncovered or loosely covered only during cooling. Whole produce that will be washed or peeled does not require covering. Check urn lids, the sugar bin, and raw chicken in holding cabinets.\n• SDC.201.b: Check whether sanitizer buckets are sitting on the floor.\n• SDC.201.c: Check for flies touching ready-to-eat food.\n• SDC.201.d: Check whether food, packaging, or utensils are placed on trash cans.\n• SDC.201.e: Look for condensation above uncovered food or food-contact surfaces.\n• SDC.201.f: Watch for hands touching food-contact portions of surfaces or utensils.\n• Also inspect overhead paint, dripping moisture, and excessive freezer frost. Containers intended for one use must be discarded after that use; do not repeatedly reuse a disposable soup-chicken bowl.\nSDC.203 — Preventing contamination during storage and preparation (HIGH)\n• SDC.203.b: Yellow gloves/aprons must not be used while handling ready-to-eat food.\n• SDC.203.i: Dirty yellow aprons must not touch clean items.\n• SDC.203.a: Separate chemicals from food, food-contact surfaces, and gloves. Use a barrier or separate storage that prevents leaks, splashes, and contact. Check both open and closed containers, including wipes. Urnex Tabz are chemicals. Kay Release may be stored with food and should be separate from other chemicals.\n• SDC.203.g: Remove objects that could fall into food, including personal belongings, dust, and magnets.\n• SDC.203.c: Keep breading-table sanitizer towels in their designated area.\n• SDC.203.e: Do not return washed produce to its original shipping carton.\n• SDC.203.h: Do not quick-thaw food in a compartment sink while dishes are being washed or stored there.\n• SDC.203.j: Look for other raw-to-ready-to-eat contamination: cooked-food kanbans or utensils on raw surfaces; mac and cheese in a cabinet used to thaw raw chicken; a fryer handle on a shelf not sanitized after a raw transfer pan; or medicines/first-aid products near food.\n• SDC.203.f: Inspect food pans and trays for physical contaminants.\nSDC.205 — Food storage hierarchy (HIGH)\n• SDC.205.a: Milk and egg wash must not be above or beside ready-to-eat foods. Check walk-in and reach-in refrigeration; the walk-in is the recommended storage location.\n• SDC.205.b: Keep raw chicken in dedicated thaw/holding cabinets when possible. If stored in the walk-in, place it below or on shelving separate from ready-to-eat food.\n• SDC.205.c: If chicken and milk/egg wash share refrigeration, chicken belongs below the wash so raw juices cannot drip onto it.\nSDC.229 — Use-First clips (LOW)\n• Use the correct clip for each raw chicken type in the thaw cabinet.\n• Approved: yellow silicone, yellow plastic, or etched metal.\n• Not approved: office/document clips, clips attached to chains, or metal clips with punched-out lettering. Do not place chains in thaw cabinets.\nRead each question carefully: some ask about safe practices and others ask whether a hazard is present.",
  "Cross-contamination Part 2": "Cross-contamination Part 2 — Assessment Checks\nSDC.225 — Sewage and grease traps (IMMEDIATE)\n• Confirm the sewage system and grease traps work. A sewage backup that cannot immediately be contained and cleaned prevents the restaurant from operating.\nSDC.227 — Drinking water (IMMEDIATE)\n• Confirm potable water is available.\nSDC.207 — Approved sources and sound packaging (HIGH)\n• SDC.207.a: Obtain produce from approved suppliers rather than a local grocery store.\n• SDC.207.d: Inspect cans and packaging for damage.\n• SDC.207.e: Check for moldy products.\n• SDC.207.f: Check for homemade products.\n• Inspect the walk-in and reach-in refrigerators.\nSDC.217 — Ingredient identification (LOW)\n• SDC.217.a: Label bulk dry ingredients with the product name.\n• SDC.217.b: Label bottles of liquid ingredients, including bun oil and grill Release Agent.\nSDC.215 — Produce washing (IMMEDIATE)\n• SDC.215.a: Wash strawberries, grape tomatoes, whole 6x6 tomatoes, and applicable bulk romaine in approved produce wash before cutting. Do not wash in shipping containers. Pre-sliced tomatoes and romaine filets do not need this wash.\n• SDC.215.b: Produce requiring treatment must not soak only in plain water.\n• SDC.215.c: Submerge applicable produce in the treatment for 90 seconds. Use Not Observable when no washing is occurring; assess only products the restaurant receives.\n• SDC.215.d: Rinse lemons under cold running water before cutting; produce wash is not required for lemons.\n• SDC.215.e: Discard the outer leaves of bulk romaine.\n• SDC.215.f: Cut the romaine base off after the produce-wash step.\n• Bulk-romaine questions apply only where that product is received; the form includes Canada/Puerto Rico applicability notes.\nSDC.219 — Storage above the floor (LOW)\n• Keep food, utensils, equipment, packaging, napkins, gloves, and other single-use items at least 6 inches off the floor.\nSDC.221 — Chemical use (HIGH)\n• SDC.221.a: Never repurpose a chemical container to hold, dispense, or transport food.\n• SDC.221.b: Use each chemical only as intended.\n• SDC.221.c: Use the CFA-approved Antimicrobial Fruit and Vegetable Treatment.\nSDC.235 — Bodily-fluid cleanup kit (HIGH)\n• SDC.235.a: Include an approved disinfectant (Kay Insta-Use, Kay Peroxide, or Purell Surface Sanitizer), Rubbermaid Over the Spill Pads, multifold towels, clear disposable gloves, a white disposable apron, black compactor bags, and cleanup instructions.\n• SDC.235.b: Store the components together.\n• SDC.235.c: Keep the kit accessible to all Team Members.\n• SDC.235.d: Check expiration dates, particularly the disinfectant.\nSDC.239 — Third-party delivery seals (LOW)\n• Verify the order with the driver, then seal each paper bag with a tamper-evident sticker. Cookie stickers may substitute when the regular stickers are on back-order.\nSDC.243 — Allergen and nutrition information (LOW)\n• SDC.243.a: Display the required allergen notices. For this mall location, place a cling between each POS on the counter. Other formats have different placements; the form notes LCV/Canada exceptions.\n• SDC.243.b–c: Team Members must be able to find both nutrition and allergen information using the POS or CFA app.\nRead each question carefully; a Yes may identify a hazard rather than compliance.",
  "Cleaning & Sanitation Part 2": "Cleaning & Sanitation Part 2 — Assessment Checks\nSupplies and test strips (MEDIUM)\n• SDC.351.a: Stock the compartment-sink dispenser with Kay SolidSense All Purpose Super Concentrate detergent.\n• SDC.351.b: Stock the sink with SolidSense or KAYQUAT sanitizer.\n• SDC.335.a: Keep quat test strips accessible, unexpired, undamaged, and in stock.\n• SDC.351.f: Provide dish-machine detergent; check the bottle below the machine is present and not empty.\n• SDC.351.g: Supply sanitizer for a low-temperature dish machine, where applicable.\n• SDC.335.b: Provide usable, unexpired chlorine strips for Kay-5 and low-temperature dish-machine checks.\n• SDC.333.b: Keep Kay-5 available for beverage nozzles and the ice-cream machine.\n• SDC.335.c: Provide usable, unexpired produce-wash strips.\nSanitizer concentrations (IMMEDIATE)\n• SDC.313.b: Newly filled compartment-sink quat sanitizer must measure 150–400 ppm. Test with quat strips; use Not Observable if the dispenser is broken.\n• SDC.313.d: Freshly prepared Kay-5 must measure 50–100 ppm using chlorine strips before addition to the hopper. Use Not Observable if not prepared. Although the strip container may show 50–200 ppm, this assessment's CFA standard is 50–100 ppm.\n• SDC.313.e: Check quat spray bottles at 150–400 ppm.\n• SDC.313.c: Check quat KICS buckets at 150–400 ppm.\n• SDC.313.a: Check every open quat bucket at 150–400 ppm.\n• Use Not Observable when the relevant spray bottles or buckets have not been prepared.\nSDC.314 — Produce-wash system (IMMEDIATE)\n• c: Confirm the dispenser is connected, operating, and used. Notify leadership if it fails; follow the approved alternate cold-running-water procedure until corrected.\n• b: Maintain concentration at 0.75–1.0 oz per gallon. Dip the correct strip, wait 3 seconds, and compare against its instructions. Dispense a fresh solution if needed for testing.\nSDC.347 — Wiping towels (MEDIUM)\n• Keep wiping cloths immersed in sanitizer. Separate towels used on food-contact surfaces from towels used on non-food-contact surfaces.\nSDC.345 — Cleaning tools (LOW)\n• a: Tools must be durable, without chips, melting, or cracks.\n• b: Use the correct tool for each task. Watch for incorrect fryer brushes, abrasive metal/green pads on dishes instead of approved yellow/blue pads, or an ice-cream hopper brush used on raw dishes.\n• c: Store tools between uses where they cannot touch or contaminate food, equipment, utensils, or packaging.\nSDC.333.a — Product labels (MEDIUM)\n• Retain readable manufacturer labels on original chemical containers.\n• Label working bottles with the common product name, such as sanitizer or window cleaner.\n• Label first-aid supplies and Team Member medicines appropriately.\n• Hand-soap dispensers are exempt from this label requirement.\nAssess only applicable equipment and read each question carefully.",
  "Time & Temperature Part 1": "Time & Temperature Part 1 — Assessment Checks\nCalibrate the food thermometer before measuring products or equipment.\nSDC.147.1 — Walk-in freezer (HIGH)\n• Frozen products must be hard and fully frozen. Check for dampness, water marks, freezer burn, or ice-crystal evidence of thawing.\nSDC.137.11 — Cabinet thermometers (MEDIUM)\n• Every thaw/holding cabinet needs a visible thermometer reading 36–40°F.\nSDC.145.1 — Refrigerated thawing (MEDIUM)\n• Verify chicken thaws properly under refrigeration.\nSDC.143.1 — Thawing labels (MEDIUM)\n• Verify correct date labels separately for regular filets, nuggets, strips, spicy filets, grilled filets, grilled nuggets, breakfast filets, spicy breakfast filets, and grilled breakfast filets.\nSDC.129 — Use-by and expiration dates (MEDIUM)\n• Check products in the assessed areas against both the prepared-product label and the manufacturer's expiration date.\n• Include thawing chicken, prepared foods, sausage, green leaf, cheese, and sliced tomatoes.\n• Filleted raw chicken should have both 24-hour and 96-hour labels. An expired 24-hour label as the only label is noncompliant.\nSDC.121 — Raw products in holding cabinets (HIGH)\n• Milk and egg wash: 40°F or colder.\n• Breaded-product raw chicken: 33–40°F. Check regular filets, nuggets, strips, spicy filets, breakfast filets, and spicy breakfast filets separately.\n• Grilled-product raw chicken: 35–40°F. Check grilled filets, grilled nuggets, and grilled breakfast filets separately.\n• Measure product temperatures rather than relying only on the cabinet display.\nSDC.137.1 — Breading-table thermometer (MEDIUM)\n• A properly set-up ice-bath unit may read 32–37°F and must not exceed 37°F.\n• A refrigerated breading-table display should read 35–38°F.\n• Verify the display/thermometer works.\nSDC.123 — Products in the breading-table rail (HIGH)\n• Each product must measure 33–40°F: milk and egg wash, regular filets, nuggets, breakfast filets, spicy filets, and spicy breakfast filets.\n• Check each applicable product independently.\nUse Not Observable only where that product or condition cannot be observed.",
  "Health & Hygiene Part 2": "Health & Hygiene Part 2 — Assessment Checks\nSDC.417 — Handwashing sinks (HIGH)\n• a: Store nothing in hand sinks.\n• b: Keep access clear of racks, boxes, and other obstacles.\n• c: Do not rinse food, utensils, equipment, or towels in them.\n• d: Do not fill pitchers or other containers at them.\n• e: Keep the sink free of food residue and accumulated debris.\n• f–i: Supply soap, paper towels, a handwashing reminder sign, and a nearby trash can.\n• j: Test every hand sink: water must reach at least 100°F.\nSDC.421 — Water supply and pressure (IMMEDIATE)\n• Provide hot/cold water and adequate pressure at all required sinks, including hand sinks and restrooms.\n• At the compartment sink, hot water must reach at least 110°F within 60 seconds.\nSDC.401 — Handwashing technique and timing (IMMEDIATE)\n• j: Wet/rinse hands; use soap; scrub fingers, nail areas, and forearms for 20 seconds; rinse; dry with a clean paper towel; use that towel to shut off the faucet.\n• c: Wash in the restroom and again at the work-area sink before returning to work.\n• d: Wash after entering the kitchen and before food preparation.\n• e: Wash when returning from a break.\n• f: Wash after coughing or sneezing.\n• g: Wash after touching the face, hair, body, or another person.\n• i: Wash before putting on gloves.\n• h: Wash when changing tasks. Wash and change gloves after dirty surfaces, raw/uncooked food, or chemicals, and before leaving the work zone.\nSDC.405 — Bare-hand contact (IMMEDIATE)\n• Prevent bare-hand contact with cooked/ready-to-eat food and raw chicken, including fries during bagging.\n• Unwashed produce and biscuit dough are exceptions to the ready-to-eat glove rule unless nail polish is worn.\nSDC.407 — Gloves (HIGH)\n• a–b: Use yellow gloves only for raw chicken, its bags, and designated raw metal trays, pans, or utensils, including handling in the walk-in/freezer.\n• c: Wear clear gloves after produce has been rinsed.\n• d: Wear clear gloves over gray cut-resistant/cloth gloves.\n• e: Cover hand bandages with gloves.\n• f: Replace torn, punctured, or dirty gloves immediately.\nSDC.423 — Personal habits and belongings (LOW)\n• a: Keep drinks covered, such as a lidded cup with a straw. Store away from—and not above—food or preparation surfaces.\n• b: Store clothing, purses, coats, speakers, and other personal items away from food-contact surfaces and preparation areas.\n• c: Keep tobacco/vaping away from exposed food, food-contact surfaces, packaging, and equipment.\n• d: Eat away from those areas. The assessment treats gum, toothpicks, and tobacco as eating.\nSDC.713 — Customer hand sanitizer (LOW)\n• a: Provide accessible sanitizer stations in the dining room and restrooms. Dining-room stations may be near entryways, counters, or open areas.\n• b: Keep the stations stocked.\nJudge each question by its wording; some identify hazards rather than correct practices.",
  "Time & Temperature Part 2": "Time & Temperature Part 2 — Assessment Checks\nCalibrate the food thermometer before taking temperatures.\nSDC.135 — Food thermometer (MEDIUM)\n• Keep at least one working, calibrated digital food thermometer available.\nSDC.113 — Grill setup (HIGH)\n• Correctly install the front deflector plate and side skirts on every grill.\nSDC.109 — Grilled chicken cook temperatures (IMMEDIATE)\n• Grilled filets, grilled nuggets, and grilled breakfast filets must reach at least 165°F immediately after cooking.\n• Measure on the grill or just after removal; use blue heat-resistant gloves as needed.\n• Enter through the side between grill marks. For filets, test both the center of the thick side and the center of the thin tip/tail; one passing reading does not prove the entire filet is cooked.\n• For nuggets, prioritize thin/flat or pale pieces and pieces with poor grill marks. Probe the thickest center without going through the other side. Follow corrective-action guidance if the temperature fails; the assessment directs passing checked nuggets to cool-down.\nSDC.115 — Breaded chicken cook temperatures (IMMEDIATE)\n• Immediately after cooking, verify at least 165°F for regular filets, breaded nuggets, strips, spicy filets, breakfast filets, and spicy breakfast filets.\n• Probe the center of the thickest part without letting the probe tip pass through.\nSDC.124 — Mac & Cheese measurement (HIGH)\n• Measure every cooked pan and take the reading in the center. Use the applicability option for locations not serving it or Canada.\nSDC.125 — Cooking(IMMEDIATE)\n• Mac & Cheese: 165°F.\nSDC.105 — Hot holding at Boards (HIGH)\n• Maintain at least 140°F for every applicable product: regular filets, nuggets, strips, spicy filets, grilled filets/nuggets, and Mac & Cheese.\nSDC.137.7 — Cold-equipment thermometers (MEDIUM)\n• Equip refrigeration with visible, accurate thermometers. Position interior thermometers near the door and away from fans. Continuous-monitoring sensors such as ComplianceMate meet this check.\nSDC.101.7 — Cold holding at Boards (HIGH)\n• Maintain 40°F or colder for green leaf, sliced tomatoes, American/Pepper Jack/Colby Jack cheese, prepared Mac & Cheese, and Monterey/cheddar shredded blend.\n• Lettuce: mound with a gloved hand, then probe the mound.\n• Tomatoes/sliced cheese: place the probe between slices.\n• Prepared Mac & Cheese: probe at least 3 locations, including the center, without touching the pan's bottom or sides.\n• Shredded cheese: insert into the product without touching the pan.\nSDC.141 — Preparation/opening labels (MEDIUM)\n• Date-label opened or prepared TCS products, including cut produce, cheese, and salads.\nSDC.129 — Expiration (MEDIUM)\n• Do not hold or sell products past their use-by or manufacturer expiration dates. Filleted raw chicken needs the 24-hour and 96-hour labels; an expired 24-hour label alone fails the check.\nSDC.133 — Time as a Public Health Control (HIGH; if used)\n• a: Limit this method to sliced American/Colby Jack/Pepper Jack cheese, cut tomatoes, and cut green leaf.\n• Do not use it for milk/egg wash, other salad ingredients, chicken, or hot-held products.\n• b–c: Use the proper TPHC labels and tracking log.\n• d: Discard the product after 4 hours.\nSDC.147.3 — Frozen foods at Boards (HIGH)\n• Frozen foods must remain solid and hard to the touch.\nAssess products separately and use the form's Not Observable/Not Applicable choices only where appropriate.",
  "Pests": "Pests — Assessment Checks\nSDC.501 — Serious pest evidence (IMMEDIATE)\n• a: Check for at least 1 live cockroach inside.\n• b: Check for at least 1 rodent inside.\n• c: Look for rodent droppings.\n• d: Inspect packaging for rodent chewing.\n• e: Look for nests or shredded paper/cardboard, especially behind equipment, in storage, or within walls/ceilings.\n• f: Check for a bird trapped inside.\n• g: Inspect food pans/containers in coolers, dry storage, and cold rails for pests.\n• Walk the restaurant and grounds, including corners, equipment backs, storage, and dumpster areas.\nSDC.503 — Other pest activity (HIGH)\n• a: Check for 3 or more flies in one area.\n• b: Check for 3 or more dead cockroaches.\n• c: Check for 10 or more ants in one area.\n• d: Look for trails of ants in food-service areas.\n• e: Look for birds nesting on the building exterior.\nSDC.509 — Entry points and harborage (LOW)\n• a: Exterior-door gaps should be less than ¼ inch. Inspect underneath every outside door; visible light may reveal a gap.\n• b: Check gaps around pipes and ducts against the ¼-inch criterion.\n• c: Remove excessive clutter/debris indoors and outdoors: old boxes, broken equipment, food scraps, trash, and leaves.\n• d: Hang mops and brooms to dry rather than leaving them on the floor.\n• e: Do not prop doors open when they are not being used, including doors to shared hallways.\nSDC.513 — Indoor control devices (LOW)\n• a: Devices must not be positioned above food-preparation or storage areas where trapped pests could contaminate food.\n• b: Check insect light traps are intact, on, and plugged in. The form offers an N/A option for malls, licensees, and captive venues.\n• c: Verify air curtains are on and functional at equipped doors.\n• d: Check for crushed, dented, or otherwise ineffective traps.\n• Report unsuitable devices, contamination risks, or pest accumulation to leadership and the pest provider.\nSDC.514 — Outdoor bait stations (LOW)\n• a: Verify stations are present and operational where required.\n• b: Check for excessive accumulated pests.\n• The listed placements are inside the dumpster corral and on each side of receiving and drive-through doors.\n• The assessment offers N/A for malls, licensees, and captive venues.\nSDC.517 — Outdoor trash and grease storage (LOW)\n• a: Close dumpster lids.\n• b: Keep the area clear of overflow, food debris, boxes, and broken equipment.\n• c: Ensure the drain plug is installed.\n• d: Clean the grease-recycling container.\n• e: Check for broken lids, cracks, or other entry points.\n• f: Keep garbage inside containers. At shared dumpsters, note overflowing CFA trash.\nSDC.521 — Professional service (MEDIUM)\n• Verify approximately monthly service, no more than about 30 days apart, for both cockroaches and rodents.\n• Review the previous quarter's records; reports must show findings and corrective actions.\n• The listed exemptions are licensees and captive venues.\nSome questions ask whether pests or defects are present. A Yes may indicate a problem; read each question before answering.",
  "Clock In": "",
  "Restaurant Tour": "",
  "How Truett Cathy Built a Good Name": ""
};
const FOH_LINKS = {
  "Food Safety Pathway has been completed": "https://www.pathway.cfahome.com/doc/crn:pathway:resource:01K88MCVKFB7YXX7KV3E02HMYZ",
  "Explains the Food Safety Five principles": "https://youtu.be/J2_9aGuy9ZU?is=1o80QFv3V0hpAH7j",
  "How Truett Cathy Built a Good Name": "https://www.pathway.cfahome.com/doc/d3bb5184-a3c3-4c6e-bc1c-70775786a1fa"
};
const STATIONS = {
  "food-safety": {
    "title": "FOH Food Safety",
    "sections": [
      [
        "Food Safety Basics",
        [
          "Food Safety Pathway has been completed",
          "Demonstrates proper handwashing",
          "All required components of uniform are present and in good condition",
          "Explains the Food Safety Five principles",
          "Team member understands proper use of gloves and aprons",
          "Understands basic use of all chemicals and where chemicals are to remain located"
        ]
      ]
    ]
  },
  "basic": {
    "title": "FOH Basic Training",
    "sections": [
      [
        "Guest Service & FOH Skills",
        [
          "Utilizes CORE 4",
          "Starts with a Warm Welcome and ends with a Fond Farewell",
          "Has basic understanding of POS system",
          "Understands and follows basic order structure",
          "Basic understanding of the menu and possible customizations",
          "Gets guest’s name and uses it at least twice",
          "Reads back order",
          "Understands how to scan and utilize CFA app features on the POS",
          "Tenders order properly",
          "Prepares beverage correctly and hands to guest",
          "Understands preparation of milkshakes, frosted beverages, iced coffees, and Icedream options",
          "Understands the second-mile service portion of Winning Hearts Everyday",
          "Understands Attentive and Courteous metric and works accordingly",
          "Executes FOH awareness",
          "Changes shake base properly",
          "Properly brews and prepares tea",
          "Properly prepares regular and diet lemonade with labels",
          "Properly changes strawberry shooter tool",
          "Properly prepares iced coffee base",
          "Understands when and how to refill the Icedream machine",
          "Understands the process of Prep Tray rotation",
          "Basic understanding of applicable food safety principles",
          "Knows how to utilize label maker and does so properly"
        ]
      ]
    ]
  },
  "bagger": {
    "title": "Bagger Training",
    "sections": [
      [
        "Bagging Skills",
        [
          "Proficient in all other FOH tasks and positions",
          "Understands what goes where in the warmer chutes",
          "Understands bagging process for fries",
          "Bags all food items with reasonable speed and excellent accuracy",
          "Understands what bags to use and when",
          "Proficient communication with the BOH team",
          "Basic understanding of the bagging matrix and dine-ready meals",
          "Understands Prep Kanban system",
          "Understands the KPS and bump bar system",
          "Proficient communication with the saucer/stuffer position when applicable",
          "Utilizes CORE 4 when handing out food to guests",
          "Awareness of mobile and third-party beverage screen and prepares items when applicable",
          "Sanitizes the chutes and other food prep surfaces every 4 hours",
          "Keeps area stocked and cleaned"
        ]
      ]
    ]
  },
  "fsa-assessments": {
    "title": "FSA Assessments",
    "sections": [
      [
        "Assessment Cards",
        [
          "Health & Hygiene Part 1",
          "Cleaning & Sanitation Part 1",
          "Cross-contamination Part 1",
          "Cross-contamination Part 2",
          "Cleaning & Sanitation Part 2",
          "Time & Temperature Part 1",
          "Health & Hygiene Part 2",
          "Time & Temperature Part 2",
          "Pests"
        ]
      ]
    ]
  },
  "rsa-assessment": {
    "title": "RSA Assessments",
    "sections": [
      [
        "Assessment Cards",
        [
          "Regular Chicken Sandwich",
          "Grilled Chicken Sandwich",
          "8-Count Regular Nuggets",
          "5-Count Grilled Nuggets",
          "Waffle Fries"
        ]
      ]
    ]
  }
};
const CLOSING = {
  "foh-closing": {
    "title": "FOH Closing",
    "sections": [
      [
        "Nightly Closing",
        [
          "All soda towers are disassembled and turned off",
          "Soda tower catch trays are clean and free of debris/residue",
          "Lemonade dispensers are broken down and taken to dish",
          "Tea urns are emptied, taken to dish, thoroughly cleaned, and returned",
          "Tea nozzles are disassembled and placed in K5 sanitizer",
          "Icedream machine is off and thoroughly cleaned and sanitized",
          "Icedream parts have been completely disassembled and taken to dish to be washed",
          "All Icedream parts are clean, free of lubricant residue, and returned to the correct location",
          "Excess Icedream is placed in the walk-in with a label or disposed of Wednesday/Saturday",
          "All necessary dessert toppings are stored in the lowboy with correct labels",
          "Shake base machine is clean and stocked with labels",
          "Shake base tray and catch pan are taken to dish and returned to the correct location",
          "Chutes have been cleaned and sanitized",
          "Lowboy fridge is cleaned and polished",
          "Sauce wall is stocked and surrounding countertop is clean",
          "Tea brewer parts are emptied, cleaned, and returned to the correct location",
          "Dry storage items are stocked and organized appropriately",
          "All countertops are cleaned and sanitized with no residue",
          "Line stanchions are separated and stowed away",
          "Floor is swept, scrubbed, squeegeed, and mopped",
          "FOH closet floor is swept underneath shelving"
        ]
      ]
    ]
  }
};

// FOH service assessments, adapted from the current OpsHub questions.
Object.assign(FOH_DETAILS, {
  "RSA Core 4": "CORE 4 — Guest interactions\n• 8.01.01: Make natural, respectful eye contact with guests.\n• 8.01.02: Share a genuine smile throughout the interaction.\n• 8.01.03: Speak with a warm, friendly tone.\n• 8.01.04: Respond “My pleasure” when a guest thanks you.\n• 8.01.05: Demonstrate all four elements during each guest interaction.\nCoach consistency: look for these behaviors throughout the interaction, rather than only once.",
  "RSA HEARD Model": "HEARD — Guest recovery\n08.08.00: Practice with a teammate acting as a guest whose order has a missing item, or observe a real recovery interaction.\n• 08.08.01 — Hear: Focus on the guest, listen closely, and clarify the issue.\n• 08.08.02 — Empathize: Show caring body language and acknowledge the guest’s concern.\n• 08.08.03 — Apologize: Say “I’m sorry” and stay focused on the issue.\n• 08.08.04 — Resolve: Thank the guest, take ownership, and solve the problem.\n• 08.08.05 — Delight: Make the recovery personal, proactive, and generous.",
  "RSA: Carry Out Service Behaviors": "CARRY OUT — Order taking\nObserve one complete order-taking interaction and one complete meal-fulfillment interaction. Use the card to coach a consistent guest experience.\n• 8.07.09f: Give the guest a warm welcome.\n• 8.07.10f: Use the guest’s name in a sentence.\n• 8.01.06f: Speak in a friendly tone.\n• 8.01.07f: Make eye contact.\n• 8.01.08f: Share a smile.\n• 8.01.09f: Say “My pleasure” when thanked.\n• 8.02.08f: Repeat the entire order before tendering. Refer to meals by product name instead of meal number.\n• 8.06.08f: Give clear verbal directions about the next step and where to receive the order.\n• 8.06.20f: Anticipate guest needs and serve proactively.\n\nCARRY OUT — Meal fulfillment\n• 8.07.09g: Greet the guest warmly at handoff.\n• 8.02.09g: Confirm the order by stating a menu item.\n• 8.07.12g: Use the guest’s name in a sentence.\n• 8.01.06g: Speak in a friendly tone.\n• 8.01.07g: Make eye contact.\n• 8.01.08g: Share a smile.\n• 8.01.09g: Say “My pleasure” when thanked.\n• 8.06.08g: Give clear verbal directions when the guest needs them.\n• 8.07.11g: Offer a friendly, fond farewell.\n• 8.06.20g: Serve proactively throughout handoff.",
  "Proactive": "PROACTIVE — Anticipate guest needs\n• 8.06.03: Anticipate needs before the guest has to ask for help.\n• 8.06.04: Notice nonverbal signs that a guest needs assistance.\n• 8.06.05: Ensure the guest has everything needed to enjoy the meal.\n• 8.06.08: Give clear directions about the next step.\n• 8.06.09: Confirm the meal when handing it out.\n• 8.06.10: Offer a choice of dipping sauces and condiments.\n• 8.06.11: Understand the mobile app process, or obtain help from a knowledgeable teammate.\n• 8.06.12: If the meal is not ready, clearly explain where it will be delivered.\n• 8.06.14: Locate and provide accurate nutrition information when requested.\n• 8.06.16: Make the third-party delivery pickup route clear and easy to follow.\n• 8.06.17: Clearly communicate the carry-out order pickup location.\n• 8.06.18: Make the mobile carry-out pickup area easy to find.\nDrive-Thru and dining-area observations from the source form are excluded. Assess only pickup services used at this restaurant.",
  "Generous": "GENEROUS — Personal guest care\n• 8.05.01: Engage the guest beyond the transaction, such as asking how their day is going.\n• 8.05.02: Look for an appropriate opportunity to surprise and delight a guest.\n• 8.05.03: Use personal, generous language, such as “My pleasure” or “What else may I do for you?”\n• 8.05.04: Demonstrate at least one generous behavior in the interaction.\n• 8.05.05: Offer condiments and a choice of dipping sauces when appropriate.\n• 8.05.06: Make a personal connection without delaying order taking.\n• 8.05.07: Offer to help carry a large order to the guest’s car, when applicable.\nFor the large-order observation, the source allows N/A when no large order is observed.\n• 8.05.08: Thank the guest sincerely.\n• 8.05.09: Use professional, courteous language consistently.\n• 8.05.10: Immediately acknowledge a guest approaching the counter.",
  "RSA Sauce and Condiment Excellence": "SAUCE & CONDIMENT EXCELLENCE — Order taker\nObserve one to three interactions at order taking and at bagging/stuffing. Reuse this card for each observation.\n• 08.02.01: Ask for the guest’s preferred sauces and condiments at least once. Include dressing for salads and wraps.\nThe source allows N/A when the guest requests them without prompting or when assessing a mobile order.\n• 08.02.02: Ask for the exact quantity of each requested sauce, condiment, or dressing.\n• 08.02.03: Enter the correct type and quantity in the POS.\n• 08.02.04: At final order confirmation, repeat both the sauce/condiment types and quantities before tendering.\n\nSAUCE & CONDIMENT EXCELLENCE — Bagging/stuffing\n• 08.02.07: Include the sauce and condiment types and quantities shown on the KPS or receipt.\nIf none are requested, this source observation is N/A.\n• 08.02.08: Place packets neatly with the order in the bag or on the tray.\n• 08.02.09: Check that packets are clean and undamaged.\n• 08.02.10: When a guest asks for extra sauce, ask for a specific quantity instead of taking a handful.\nIf no extra sauce is requested, this source observation is N/A.",
  "RSA Accuracy": "ACCURACY — Order confirmation and fulfillment\n• 8.02.01: Confirm the guest’s order before completing the transaction.\n• 8.02.02: Randomly check assembled orders for the correct products and customizations.\n• 8.02.04: Provide a complete, ready-to-eat meal with the required sauces, condiments, napkins, and utensils.\n• 8.02.05: If the meal is not ready, deliver it to the location the guest was told.\n• 8.02.07: Answer menu questions accurately and clearly; ask a knowledgeable teammate for help when needed.\nDrive-Thru speed and dine-in table-marker questions from the source form are excluded."
});
STATIONS["rsa-assessment"].sections = [
  [
    "Guest Service Assessments",
    [
      "RSA Core 4",
      "RSA HEARD Model",
      "RSA: Carry Out Service Behaviors",
      "Proactive",
      "Generous",
      "RSA Sauce and Condiment Excellence",
      "RSA Accuracy"
    ]
  ],
  [
    "Food Quality Assessments",
    [
      "Regular Chicken Sandwich",
      "Grilled Chicken Sandwich",
      "8-Count Regular Nuggets",
      "5-Count Grilled Nuggets",
      "Waffle Fries"
    ]
  ]
];
