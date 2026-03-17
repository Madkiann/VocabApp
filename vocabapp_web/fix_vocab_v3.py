import re
import json

vocab_js_path = r"c:\Games\vocabapp\vocabapp_web\src\data\vocabulary.js"
vocab_md_path = r"c:\Games\vocabapp\ELLE SEÇİLEN VOCAB.md"

def get_objects_from_text(text):
    objs = []
    # Use a stack-based approach to extract JSON objects
    # This handles nested structures correctly
    start_indices = []
    for i, char in enumerate(text):
        if char == '{':
            start_indices.append(i)
        elif char == '}':
            if start_indices:
                start = start_indices.pop()
                if not start_indices: # Root level object
                    obj_str = text[start:i+1]
                    # Clean up JS-isms to make it JSON
                    # 1. Trailing commas
                    clean_obj = re.sub(r",\s*([\]}])", r"\1", obj_str)
                    # 2. Unquoted keys if any
                    # clean_obj = re.sub(r"(\n\s*)(\w+):", r'\1"\2":', clean_obj)
                    
                    try:
                        # Attempt to parse
                        # We might need to handle single quotes too if they exist
                        # But the file seems to use double quotes
                        objs.append(json.loads(clean_obj))
                    except:
                        # Fallback for keys without quotes or other minor syntax differences
                        try:
                            # Try to wrap unquoted keys
                            clean_obj_fixed = re.sub(r'([{,])\s*(\w+)\s*:', r'\1"\2":', clean_obj)
                            objs.append(json.loads(clean_obj_fixed))
                        except:
                            pass
    return objs

# 1. Load objects from broken JS file
with open(vocab_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

all_objs_js = get_objects_from_text(js_content)
# Filter for actual vocabulary/phrasal objects (they have 'word' and 'trWord' or 'meaning')
valid_objs_js = [o for o in all_objs_js if 'word' in o and ('trWord' in o or 'meaning' in o)]

print(f"Extraction from JS: Found {len(valid_objs_js)} valid items.")

# 2. Load objects from MD file
with open(vocab_md_path, 'r', encoding='utf-8') as f:
    md_content = f.read()

all_objs_md = get_objects_from_text(md_content)
valid_objs_md = [o for o in all_objs_md if 'word' in o]

print(f"Extraction from MD: Found {len(valid_objs_md)} valid items.")

# 3. Combine and Deduplicate
all_items_map = {}

# Process existing JS items first (they might have older IDs)
for item in valid_objs_js:
    word = item.get('word', '').strip().lower()
    if not word: continue
    all_items_map[word] = item

# Overlay MD items (they are newer)
for item in valid_objs_md:
    word = item.get('word', '').strip().lower()
    if not word: continue
    # If duplicate, MD version is likely better/intended
    all_items_map[word] = item

print(f"Unique items total: {len(all_items_map)}")

# 4. Correct Distribution
vocal_list = []
phrasal_list = []

for word, item in all_items_map.items():
    # Force 'Check up on' to phrasal as decided
    if word == "check up on":
        item['targetMode'] = "Phrasal Verbs"
    
    # Heuristic for phrasal
    is_phrasal = False
    if item.get('targetMode') == "Phrasal Verbs":
        is_phrasal = True
    elif item.get('pos', '').lower() == "phrasal verb":
        is_phrasal = True
    elif ' ' in item.get('word', '') and item.get('pos', '') in ['', 'verb']:
        is_phrasal = True
    
    # Clean up syncToChill
    if 'syncToChill' not in item:
        item['syncToChill'] = True

    if is_phrasal:
        item['targetMode'] = "Phrasal Verbs"
        phrasal_list.append(item)
    else:
        # If it was added via MD, it has targetMode 'vocabulary'
        # If it was old item, it has nothing.
        vocal_list.append(item)

# Sort them to keep it clean
vocal_list.sort(key=lambda x: str(x.get('id', '9999')))
phrasal_list.sort(key=lambda x: str(x.get('id', '9999')))

print(f"Distribution -> Vocal: {len(vocal_list)}, Phrasal: {len(phrasal_list)}")

# 5. Rebuild file
header = """export const rawVocabulary = """
phrasal_header = """export const rawPhrasalVerbs = """
sm2_logic = """
export const initialVocabulary = rawVocabulary.map(w => ({
    ...w,
    sm2: { rep: 0, int: 0, ef: 2.5, nextDate: Date.now(), totalReviews: 0, correctReviews: 0, lastQualityScore: 0 }
}));

export const initialPhrasalVerbs = rawPhrasalVerbs.map(w => ({
    ...w,
    sm2: { rep: 0, int: 0, ef: 2.5, nextDate: Date.now(), totalReviews: 0, correctReviews: 0, lastQualityScore: 0 }
}));

export const commonWords = {};
export const localDict = {};

function populateDict(array) {
    if (!array || !Array.isArray(array)) return;
    array.forEach(w => {
        if (w && w.word && w.trWord) {
            localDict[w.word.toLowerCase()] = w.trWord.toLowerCase();
            localDict[w.trWord.toLowerCase()] = w.word.toLowerCase();
        } else if (w && w.word && w.meaning) {
            localDict[w.word.toLowerCase()] = w.meaning.toLowerCase();
            localDict[w.meaning.toLowerCase()] = w.word.toLowerCase();
        }
    });
}

populateDict(rawVocabulary);
populateDict(rawPhrasalVerbs);
"""

new_content = header + json.dumps(vocal_list, indent="\t", ensure_ascii=False) + ";\n\n"
new_content += phrasal_header + json.dumps(phrasal_list, indent="\t", ensure_ascii=False) + ";\n"
new_content += sm2_logic

with open(vocab_js_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Vocabulary.js RESTORED and OPTIMIZED.")
