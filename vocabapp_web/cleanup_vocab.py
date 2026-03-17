import re
import json

vocab_js_path = r"c:\Games\vocabapp\vocabapp_web\src\data\vocabulary.js"

with open(vocab_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Helper to extract an array by name
def extract_array(name, text):
    start_match = re.search(f"export const {name} = \\[", text)
    if not start_match:
        return None, None, None
    
    start_pos = start_match.end() - 1
    depth = 0
    end_pos = -1
    for i in range(start_pos, len(text)):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                end_pos = i + 1
                break
    
    if end_pos == -1:
        return None, None, None
    
    array_str = text[start_pos:end_pos]
    # Clean up JS specific things to make it JSON-ish
    # But wait, JS objects might not have quotes on keys.
    # Our vocabulary.js seems to have quotes on keys mostly.
    return array_str, start_match.start(), end_pos

# Since the file might have JS syntax (no quotes on keys), 
# we should be careful. 
# But let's look at the file content samples.
# "id": "...", "word": "..." -> They HAVE quotes.

def js_to_py(js_str):
    # This is risky but let's try a simple approach
    # 1. Remove trailing commas in arrays/objects
    js_str = re.sub(r",\s*([\]}])", r"\1", js_str)
    # Actually, let's just use json.loads if possible.
    try:
        return json.loads(js_str)
    except:
        # Fallback: very basic manual parse or regex
        # Let's try to wrap keys in quotes if they aren't
        # js_str = re.sub(r"(\w+):", r'"\1":', js_str)
        # return json.loads(js_str)
        print("Failed to parse array as JSON. Using fallback.")
        # We'll just return it as a list of objects if we can split them
        return None

# Actually, let's use a more robust regex to find objects {}
def get_objects(text):
    objs = []
    # Find all { ... } at depth 1
    depth = 0
    start = -1
    for i in range(len(text)):
        if text[i] == '{':
            if depth == 0:
                start = i
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0 and start != -1:
                obj_str = text[start:i+1]
                # Try to clean and parse
                clean_obj = re.sub(r",\s*([\]}])", r"\1", obj_str)
                # Fix missing quotes on keys if any
                clean_obj = re.sub(r"(\n\s*)(\w+):", r'\1"\2":', clean_obj)
                try:
                    objs.append(json.loads(clean_obj))
                except Exception as e:
                    print(f"Skipping object due to error: {e}")
                    # print(clean_obj[:100])
    return objs

raw_vocal_str, v_start, v_end = extract_array("rawVocabulary", content)
raw_phrasal_str, p_start, p_end = extract_array("rawPhrasalVerbs", content)

vocal_objs = get_objects(raw_vocal_str) if raw_vocal_str else []
phrasal_objs = get_objects(raw_phrasal_str) if raw_phrasal_str else []

print(f"Loaded {len(vocal_objs)} vocabulary items and {len(phrasal_objs)} phrasal verbs.")

# Combined pool
all_items = vocal_objs + phrasal_objs

# Deduplicate by word (case insensitive)
unique_items = {}
for item in all_items:
    word = item.get('word', '').strip().lower()
    if not word: continue
    
    # If duplicate, prefer the one with more details or the newer one (we'll see)
    if word in unique_items:
        # Check which one is better
        if len(str(item)) > len(str(unique_items[word])):
            unique_items[word] = item
    else:
        unique_items[word] = item

print(f"After deduplication: {len(unique_items)} items.")

# Redistribute
final_vocal = []
final_phrasal = []

for word, item in unique_items.items():
    # Heuristic for phrasal:
    # 1. targetMode is Phrasal Verbs
    # 2. pos is phrasal verb
    # 3. word has more than one word AND (pos contains verb or no pos)
    
    is_phrasal = False
    if item.get('targetMode') == "Phrasal Verbs":
        is_phrasal = True
    elif item.get('pos', '').lower() == "phrasal verb":
        is_phrasal = True
    elif ' ' in item.get('word', '') and (item.get('pos', '').lower() in ['', 'verb', 'none']):
        # Exceptions like "Subtle" is one word. 
        # "Check up on" is 3 words.
        is_phrasal = True

    if is_phrasal:
        item['targetMode'] = "Phrasal Verbs"
        final_phrasal.append(item)
    else:
        # Default to vocabulary
        # Existing items didn't have targetMode, let's keep it that way for them to avoid noise
        # but if it's one of OUR new items, keep "vocabulary"
        if item.get('targetMode') == "vocabulary":
             item['targetMode'] = "vocabulary"
        final_vocal.append(item)

print(f"Final Count -> Vocal: {len(final_vocal)}, Phrasal: {len(final_phrasal)}")

# Reconstruct the file
# We'll replace the arrays in place

def format_objs(objs):
    return "[\n" + ",\n".join([json.dumps(obj, indent="\t", ensure_ascii=False) for obj in objs]) + "\n]"

new_vocal_str = format_objs(final_vocal)
new_phrasal_str = format_objs(final_phrasal)

# We need to be careful with the order of replacement if indices shift
# Let's do it from end to beginning
if p_start > v_start:
    content = content[:p_start] + new_phrasal_str + content[p_end:]
    content = content[:v_start] + new_vocal_str + content[v_end:]
else:
    content = content[:v_start] + new_vocal_str + content[v_end:]
    content = content[:p_start] + new_phrasal_str + content[p_end:]

with open(vocab_js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Vocabulary.js updated successfully.")
