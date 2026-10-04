const SUPABASE_URL = "https://xzwwceoexdnarlcxbqbh.supabase.co";
const SUPABASE_KEY = "sb_publishable_j5BXr-16DXeukNiSK9SKhA_Fm0v8UdL";

const FOOD_SAFETY_DETAILS = {
  "Demonstrates proper handwashing": "Demonstrate the handwashing procedure taught in Pathway and explain when hands must be washed.",
  "Wears all required uniform components": "This includes correct belt, shirt, pants, non-slip shoes, name tag, hair restraints if applicable, and hairnet. Let leadership know if an item needs to be replaced or reordered.",
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
