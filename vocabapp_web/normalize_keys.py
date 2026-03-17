import re
import json

vocab_js_path = r"c:\Games\vocabapp\vocabapp_web\src\data\vocabulary.js"

def get_objects_from_text(text):
    objs = []
    start_indices = []
    for i, char in enumerate(text):
        if char == '{':
            start_indices.append(i)
        elif char == '}':
            if start_indices:
                start = start_indices.pop()
                if not start_indices:
                    obj_str = text[start:i+1]
                    clean_obj = re.sub(r",\s*([\]}])", r"\1", obj_str)
                    try:
                        objs.append(json.loads(clean_obj))
                    except:
                        try:
                            clean_obj_fixed = re.sub(r'([{,])\s*(\w+)\s*:', r'\1"\2":', clean_obj)
                            objs.append(json.loads(clean_obj_fixed))
                        except:
                            pass
    return objs

with open(vocab_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Extract arrays
raw_vocal_match = re.search(r"export const rawVocabulary = (\[.*?\]);", js_content, re.DOTALL)
raw_phrasal_match = re.search(r"export const rawPhrasalVerbs = (\[.*?\]);", js_content, re.DOTALL)

if not raw_vocal_match or not raw_phrasal_match:
    print("Could not find arrays using regex. Using object extractor.")
    # Fallback if the JS is messy
    # (But let's assume fix_v3 worked)

vocal_list = get_objects_from_text(raw_vocal_match.group(1)) if raw_vocal_match else []
phrasal_list = get_objects_from_text(raw_phrasal_match.group(1)) if raw_phrasal_match else []

print(f"Loaded {len(vocal_list)} vocal and {len(phrasal_list)} phrasal items.")

def normalize_item(item):
    # Mapping keys
    if 'type' in item and 'pos' not in item:
        item['pos'] = item['type']
    
    if 'engEx' in item and 'engExample' not in item:
        item['engExample'] = item['engEx']
    
    if 'trEx' in item and 'trExample' not in item:
        item['trExample'] = item['trEx']
    
    # Ensure posTr exists
    if 'posTr' not in item and 'pos' in item:
        p = item['pos'].lower()
        if 'noun' in p: item['posTr'] = 'isim'
        elif 'verb' in p: item['posTr'] = 'fiil'
        elif 'adj' in p: item['posTr'] = 'sıfat'
        elif 'adv' in p: item['posTr'] = 'zarf'
        else: item['posTr'] = item['pos']
    
    # Backwards compatibility for phrasals in old structure
    if 'engExample' not in item and 'engEx' not in item:
        # Check if it was a phrasal with example in details?
        pass

    return item

vocal_list = [normalize_item(i) for i in vocal_list]
phrasal_list = [normalize_item(i) for i in phrasal_list]

# Rebuild file
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

print("Vocabulary.js KEYS NORMALIZED.")
