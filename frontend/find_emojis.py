import os
import re

def find_emojis(directory):
    # Regex to match emojis (basic range, not exhaustive but covers most standard emojis used)
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]')
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            if emoji_pattern.search(line):
                                print(f"{path}:{i+1} -> {line.strip()}")
                except Exception as e:
                    pass

find_emojis('src')
