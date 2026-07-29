import os
import re

def strip_emojis(text):
    emoji_pattern = re.compile(
        u"(\ud83d[\ude00-\ude4f])|"  # emoticons
        u"(\ud83c[\udf00-\uffff])|"  # symbols & pictographs (1 of 2)
        u"(\ud83d[\u0000-\uddff])|"  # symbols & pictographs (2 of 2)
        u"(\ud83d[\ude80-\udeff])|"  # transport & map symbols
        u"(\ud83c[\udde0-\uddff])|"  # flags (iOS)
        u"([\u2600-\u27BF])|"        # miscellaneous symbols
        u"(\u2B50)|"                 # star
        u"(\u231A-\u231B)|"          # watch, hourglass
        u"(\u23E9-\u23EC)|"          # fast forward, rewind
        u"(\u23F0-\u23F3)|"          # alarm clock, stopwatch
        u"(\u25FD-\u25FE)|"          # medium small white/black square
        u"(\u2614-\u2615)|"          # umbrella, hot beverage
        u"(\u2648-\u2653)|"          # zodiac signs
        u"(\u267F)|"                 # wheelchair
        u"(\u2693)|"                 # anchor
        u"(\u26A1)|"                 # high voltage
        u"(\u26AA-\u26AB)|"          # medium white/black circle
        u"(\u26BD-\u26BE)|"          # soccer, baseball
        u"(\u26C4-\u26C5)|"          # snowman, sun behind cloud
        u"(\u26CE)|"                 # ophiuchus
        u"(\u26D4)|"                 # no entry
        u"(\u26EA)|"                 # church
        u"(\u26F2-\u26F3)|"          # fountain, golf
        u"(\u26F5)|"                 # sailboat
        u"(\u26FA)|"                 # tent
        u"(\u26FD)|"                 # fuel pump
        u"(\u2705)|"                 # check mark button
        u"(\u270A-\u270B)|"          # raised fist, raised hand
        u"(\u2728)|"                 # sparkles
        u"(\u274C)|"                 # cross mark
        u"(\u274E)|"                 # cross mark button
        u"(\u2753-\u2755)|"          # question mark, exclamation mark
        u"(\u2757)|"                 # heavy exclamation mark symbol
        u"(\u2795-\u2797)|"          # plus, minus, divide
        u"(\u27B0)|"                 # curly loop
        u"(\u27BF)|"                 # double curly loop
        u"(\u2934-\u2935)|"          # arrow pointing rightwards then curving upwards/downwards
        u"(\u2B05-\u2B07)|"          # left, up, down arrow
        u"(\u2B1B-\u2B1C)|"          # black/white large square
        u"(\u3297)|"                 # Japanese congratulation button
        u"(\u3299)|"                 # Japanese secret button
        u"(\u23F8-\u23FA)|"          # play/pause/record
        u"(\U0001f300-\U0001f5ff)|"  # miscellaneous symbols and pictographs
        u"(\U0001f600-\U0001f64f)|"  # emoticons
        u"(\U0001f680-\U0001f6ff)|"  # transport and map symbols
        u"(\U0001f700-\U0001f77f)|"  # alchemical symbols
        u"(\U0001f780-\U0001f7ff)|"  # geometric shapes extended
        u"(\U0001f800-\U0001f8ff)|"  # supplemental arrows-C
        u"(\U0001f900-\U0001f9ff)|"  # supplemental symbols and pictographs
        u"(\U0001fa00-\U0001faff)",  # chess symbols
        flags=re.UNICODE
    )
    return emoji_pattern.sub(r'', text)

file_path = 'src/constants/enums.js'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    line = strip_emojis(line)
    # also strip empty icon fields if it left ', icon: '' '
    line = line.replace(", icon: ''", "")
    line = line.replace(", icon: ' '", "")
    # also remove emojis from avatars if they are unicode
    line = line.replace(" avatar: '',", "")
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
