const SUPABASE_URL = "https://xzwwceoexdnarlcxbqbh.supabase.co";
const SUPABASE_KEY = "sb_publishable_j5BXr-16DXeukNiSK9SKhA_Fm0v8UdL";

const FOOD_SAFETY_TITLES = {
  "Completes the Food Safety Pathway training": "Food Safety Pathway has been completed",
  "Wears all required uniform components": "All required components of uniform are present and in good condition",
  "Explains the four food safety principles": "Team Member knows and understands the basics of the Food Safety 5",
  "Demonstrates proper glove use and knows when to change gloves": "Team member understands proper use of gloves and aprons",
  "Identifies cleaning chemicals and explains their correct uses": "Understands basic use of all chemicals and where chemicals are to remain located"
};

const FOOD_SAFETY_DETAILS = {
  "Demonstrates proper handwashing": "Demonstrate the handwashing procedure taught in Pathway and explain when hands must be washed.",
  "Wears all required uniform components": "This includes correct belt, shirt, pants, non-slip shoes, name tag, hair restraints if applicable, and hairnet.",
  "Explains the four food safety principles": "Cross Contamination, Time and Temperature, Health and Hygiene, Cleaning and Sanitation",
  "Demonstrates proper glove use and knows when to change gloves": "Include when to change gloves, specifically noting that touching the face, phone, or anything that is not food safe requires changing gloves.",
  "Identifies cleaning chemicals and explains their correct uses": "Degreaser, Super Contact Cleaner, Sizzle Spray, Multi Surface, Sanitizer (wipes and spray), Release Agent, Drain Cleaner"
};

const STATIONS = {
  "food-safety": {
  "title": "BOH Food Safety",
  "sections": [
    [
      "Food Safety",
      [
        "Completes the Food Safety Pathway training",
        "Demonstrates proper handwashing",
        "Wears all required uniform components",
        "Explains the four food safety principles",
        "Demonstrates proper glove use and knows when to change gloves",
        "Identifies cleaning chemicals and explains their correct uses"
      ]
    ]
  ]
},
  "primary": {
    "title": "Primary",
    "sections": [
      ["Make", [
        "Regular CFA Sandwich",
        "Spicy CFA Sandwich",
        "CFA Deluxe",
        "Spicy Deluxe",
        "Grilled Sandwich",
        "Grilled Club"
      ]],
      ["Orders", [
        "Bump and label correctly",
        "Cobb/customized salads",
        "Place items in correct chutes"
      ]],
      ["AHA + Communication", [
        "Communicate with bagger and breader",
        "Follow the PAN system.",
        "Use AHA tracking",
        "Know chute quantities and corresponding hold times"
      ]],
      ["Station", [
        "Follow food-safety principles",
        "Keep Primary stocked, clean, and organized"
      ]]
    ]
  },
  "secondary": {
    "title": "Secondary",
    "sections": [
      ["Make", ["Nuggets", "Strips", "Mac & Cheese", "Grilled Nuggets"]],
      ["Orders", [
        "Use nugget/strip box tabs and labels correctly",
        "Cobb/customized salads",
        "Place items in correct chutes",
        "Bake and bag cookies"
      ]],
      ["AHA + Communication", [
        "Communicate with bagger and breader",
        "Follow the PAN system.",
        "Use AHA tracking",
        "Know chute quantities and corresponding hold times"
      ]],
      ["Station", [
        "Follow food-safety principles",
        "Keep Secondary stocked, clean, and organized"
      ]]
    ]
  },
  "machines": {
    "title": "Machines",
    "sections": [
      ["Equipment", [
        "Properly use Henny Penny fryers",
        "Properly use Garland grill"
      ]],
      ["Cooking", [
        "Know when, what, and how much protein is needed",
        "Use correct timers"
      ]],
      ["Grill Cool-Down Process", [
        "After the 30-minute timer expires, get a silver baking pan",
        "Get the correct label stickers",
        "Place grilled chicken on the silver pan: grilled filets stacked no more than 2 high; grilled nuggets spread in a single layer with no stacking or piling",
        "Place the labels on the pan",
        "On the iPad/tablet, start the grill cool-down timer",
        "Let the chicken sit at room temperature for 1 hour",
        "Wrap food film around the long sides of the pan and leave the 2 short sides untucked",
        "After 1 hour, place the pan in the walk-in refrigerator",
        "Leave 3 inches of space above and below the pan on the cooling rack",
        "Filets must cool to 70°F within 2 hours from the time written on the sticker"
      ]],
      ["Communication + AHA", [
        "Communicate with breader. Follow the PAN system.",
        "Use AHA tracking"
      ]],
      ["Equipment Care", [
        "Clean and maintain equipment between uses",
        "Perform lockouts when necessary"
      ]]
    ]
  },
  "breading": {
    "title": "Breading",
    "sections": [
      ["Chicken", [
        "Load grilled chicken properly",
        "Chicken rotations",
        "Correct fileting",
        "Bread filets and spicy filets",
        "Bread nuggets",
        "Bread strips"
      ]],
      ["Coater + Milkwash", [
        "Follow chicken load amounts",
        "Add new coater when needed",
        "Properly sift coater",
        "Prepare milkwash"
      ]],
      ["Grilled + Rotation", [
        "Drop grilled filets/nuggets",
        "Marinate and prepare grilled filets/nuggets",
        "Load chicken on tier baskets",
        "Execute rotation correctly"
      ]],
      ["Execution + Communication", [
        "Communicate with Boards",
        "Use yellow gloves and apron",
        "Know how much to drop and why"
      ]]
    ]
  },
  "fries": {
    "title": "Fries",
    "sections": [
      ["Make", [
        "Prepare waffle fries for orders",
        "Know step-by-step how to drop fries, shake, hit the timer, cook, bring up the fries, shake, and dump fries into the fry dispenser",
        "Know the correct salt amount/clicks for each batch size",
        "Prepare no-salt fries when applicable"
      ]],
      ["Hold", [
        "Know fry holding time and temperature",
        "Fries in the fry dispenser — 5-minute hold time",
        "Place fries in the fry chute — 2-minute hold time",
        "Place fries in correct chutes"
      ]],
      ["Communication + Fryers", [
        "Communicate clearly with bagger",
        "Know when/how to perform filter lockout"
      ]],
      ["Station", [
        "Follow food-safety principles",
        "Keep fry fridge stocked",
        "Keep area clean, stocked, and organized"
      ]]
    ]
  }
};

const CLOSING = {
  "boards": {
    "title": "Closing Boards",
    "sections": [
      ["Food + Cold Rail", [
        "Store and label cold-rail items",
        "Store/label leftover grilled chicken for cool down",
        "Clean and turn off cold rail"
      ]],
      ["Warmers + Equipment", [
        "Clear kanbans/grilled pans",
        "Clean and sanitize chicken warmers",
        "Disassemble/clean Merco warmers",
        "Clean chicken slicer"
      ]],
      ["Boards Cleaning", [
        "Empty bacon containers",
        "Clean and sanitize inside cold rail",
        "Clean toaster/Teflon",
        "Clean shelving",
        "Degrease, clean, and sanitize drop station"
      ]],
      ["Finish", [
        "Take remaining dishes to dish area",
        "Return clean dishes to correct locations",
        "Restock the area"
      ]]
    ]
  },
  "machines-close": {
    "title": "Closing Machines",
    "sections": [
      ["Shut Down + Clean", [
        "Properly shut down Henny Penny fryers",
        "Clean inside and outside of chicken Henny Pennys",
        "Clean inside and outside of fry Henny Pennys"
      ]],
      ["Finish the Area", [
        "Sweep, scrub, and squeegee behind/under machines",
        "Turn off, disassemble, and clean grill",
        "Take chicken baskets to dish and return them to correct location"
      ]]
    ]
  },
  "breading-close": {
    "title": "Closing Breading Table",
    "sections": [
      ["Chicken + Rotation", [
        "Move chicken to clean, newly lined pans",
        "Complete necessary fileting/rotation",
        "Store chicken in holding cabinet"
      ]],
      ["Breading Tables", [
        "Disassemble, clean, and sanitize tables",
        "Remove all debris",
        "Clean and sanitize filet table"
      ]],
      ["Milkwash + Coater + Dishes", [
        "Dispose of milkwash properly",
        "Store/dispose of excess coater",
        "Take applicable dishes to dish separately",
        "Clean and sanitize raw tool bin"
      ]],
      ["Storage + Cabinets", [
        "Clean/sanitize breading shelves",
        "Clean and sanitize holding/thaw cabinet doors inside and out"
      ]]
    ]
  },
  "dishes": {
    "title": "Closing Dishes",
    "sections": [
      ["Dishwashing", [
        "Follow proper dishwashing procedure",
        "Place dishes correctly on racks",
        "Make sure all dishes are thoroughly cleaned and sanitized"
      ]],
      ["Soap + Sanitizer", [
        "Maintain proper sanitizer concentration and temperature",
        "Refill soap/sanitizer",
        "Sanitize sink compartments"
      ]],
      ["Raw vs. Regular", [
        "Keep raw and regular dishes separated",
        "Sanitize sink compartments when switching from raw dishes"
      ]],
      ["End of Day", [
        "Clean and sanitize sink compartments",
        "Clear grease trap of debris/standing water",
        "Empty, clean, and sanitize soak tub (Benji)"
      ]]
    ]
  }
};


const RSA_ASSESSMENT_DETAILS = {
  "Regular Chicken Sandwich": "Chick-fil-A Regular Chicken Sandwich \n\n – Internal Temperature\n• Filet temp ≥ 140°F\n\n – Packaging Cleanliness\n• No stains, smudges, or residue larger than a nickel\n\n– Packaging\n• Correct foil bag\n• Folded to approximately 2½ inches\n\n – White Bun Quality\n• Not torn\n• Not crushed\n• No flaking or peeling\n\n – Butter Coverage\n• Crown evenly buttered\n• Heel evenly buttered\n\n\n – Crown Toasting\n• Evenly toasted\n• Correct golden-brown color\n• No burnt or under-toasted areas\n\n– Filet Bun Coverage\n• Acceptable bun coverage\n\n – Filet Appearance\n• Golden brown\n• Most attractive side facing up\n\n – Breading Coverage\n• Bare spots total no larger than a quarter\n\n – Coater Coverage\n• Fully coated with seasoned coater\n• Generous, even coverage\n• No large lumps\n\n – Filet Weight\n• 3.3 oz or greater\n\n – Pickle Placement\n• 2 whole pickle chips\n• 3 pickle chips if less than 1.25 inch diameter\n• Spread out in center of bun heel\n\n – Heel Toasting\n• Evenly toasted\n• Correct golden-brown color\n• No burnt or under-toasted areas\n\n – Taste & Texture\n• Sweet and salty taste\n• Juicy, tender filet\n• Crisp coating\n• Fresh, soft bun",
  "Grilled Chicken Sandwich": "Chick-fil-A Grilled Chicken Sandwich – QUIV Index Card\n\n04.01.01 – Clamshell Packaging\n• Both locking tabs secured\n• Product not protruding\n\n04.01.02 – Clamshell Cleanliness\n• Outside clean\n• Stains no larger than a quarter\n\n04.01.03 – Internal Temperature\n• Grilled filet temp ≥ 140°F\n\n04.01.04 – Ingredient Order\n• Ingredients layered in correct order\n\n04.01.05 – Packaging\n• Correct clamshell\n• Correct sleeve\n\n04.01.06 – Bun Quality\n• Not torn\n• Not crushed\n• No flaking\n• No peeling\n\n04.01.07 – Crown Toasting\n• Evenly toasted\n• Correct color\n\n04.01.08 – Grilled Filet Appearance\n• Correct color\n• Best grill marks facing up\n\n04.01.09 – Carbon Build-Up\n• No carbon build-up on either side\n\n04.01.10 – Grilled Filet Weight\n• Weight ≥ 2.7 oz\n\n04.01.11 – Tomatoes\n• 2 tomato slices present\n\n04.01.12 – Green Leaf Lettuce\n• 2 pieces Green Leaf lettuce present\n\n04.01.13 – Bun Coverage\n• Acceptable bun coverage\n• Filet centered\n\n04.01.14 – Heel Toasting\n• Evenly toasted\n• Correct color\n\n04.01.15 – Honey Roasted BBQ\n• 1 Honey Roasted BBQ packet served\n\n04.01.16 – Taste & Texture\n• Juicy, tender filet\n• Proper grilled flavor\n• Fresh vegetables\n• Fresh bun\n• Meets taste and texture standards\n\nQuick Memory Version:\n140°F • Closed Clamshell • Stains ≤ Quarter • Correct Build • Correct Sleeve • Good Bun • Crown Toasted • Best Grill Marks Up • No Carbon • ≥ 2.7 oz • 2 Tomatoes • 2 Lettuce • Good Bun Coverage • Heel Toasted • 1 HRBBQ Packet • Juicy & Tender",
  "8-Count Regular Nuggets": "Chick-fil-A 8 Count Nugget \n\n – Internal Temperature\n• Nuggets internal temperature ≥ 140°F\n\n02.01.02 – Packaging & Presentation\n• Correct container\n• Properly closed\n• Nugget tab\n\n – Packaging Cleanliness\n• No stains, smudges, or residue larger than a nickel\n\n – Packaged Weight\n• Packaged 8-count nuggets weigh ≥ 4.2 oz\n\n – Nugget Count\n• 8 nuggets in the box\n\n – Nugget Box Cleanliness\n• No scraps in the nugget box\n\n – Nugget Color\n• Golden brown appearance\n• Consistent color\n• Meets quality photo standards\n\n – Coater Coverage\n• Fully coated with seasoned coater\n• Generous, even coating\n• No large lumps\n• No uncooked coater\n\n – Bare Spot Coverage\n• Bare spots collectively no larger than a dime\n\n – Taste & Texture\n• Signature Chick-fil-A flavor\n• Sweet and salty taste\n• Tender, juicy chicken\n• Crisp coating",
  "5-Count Grilled Nuggets": "Chick-fil-A 5-Count Grilled Nuggets – QUIV Index Card\n\n01.06.01 – Packaging & Presentation\n• Correct container\n• Properly closed\n• Presented correctly\n\n01.06.02 – Packaged Weight\n• Weight ≥ 2.0 oz\n\n01.06.03 – Internal Temperature\n• Grilled Nuggets ≥ 140°F\n\n01.06.04 – Nugget Count\n• 5 Grilled Nuggets in bowl\n\n01.06.05 – Color & Grill Marks\n• Correct color\n• Best grill marks visible\n\n01.06.06 – Taste & Texture\n• Tender and juicy\n• Proper grilled flavor\n• Meets taste and texture standards\n\nQuick Memory Version:\nCorrect Bowl • ≥ 2.0 oz • ≥ 140°F • 5 Nuggets • Correct Color • Best Grill Marks Visible • Tender & Juicy • Proper Grilled Flavor",
  "Waffle Fries": "Chick-fil-A Waffle Potato Fries – QUIV Index Card\n\n03.01.01 – Internal Temperature\n• Temp 3 fries\n• All 3 fries ≥ 170°F\n\n03.01.02 – Package Fill Level\n• Package appears full\n• No visible underfilling\n\n03.01.03 – Packaging Cleanliness\n• Carton clean\n• Stains/smudges collectively ≤ nickel size\n• Check all sides and bottom\n\n03.01.04 – Medium Fry Weight\n• Packaged weight between 4.2 oz and 5.2 oz\n\n03.01.05 – Fry Texture & Cook Quality\n• Evenly cooked\n• Crisp on outside\n• Soft on inside\n• Not scorched\n• Not soggy\n\n03.01.06 – Fry Separation\n• No excessive clumping\n• No 3 or more fries stuck together\n\n03.01.07 – Fry Color\n• Golden brown\n• Consistent color\n• Meets quality photo standards\n\n03.01.08 – Taste & Texture\n• Proper potato flavor\n• Lightly salted\n• Crisp outside\n• Soft and fluffy inside\n• Meets taste and texture standards\n\n03.01.09 – Small Pieces\n• No excessive number of small pieces\n• Mostly full-size fries\n\nQuick Memory Version:\n170°F (3 Fries) • Full Carton • Clean Carton ≤ Nickel • 4.2–5.2 oz • Crisp Outside/Soft Inside • No 3+ Clumps • Golden Brown • Lightly Salted • Proper Potato Flavor • No Excessive Small Pieces"
};
STATIONS['rsa-assessment'] = {
  "title": "RSA Assessment",
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
};
