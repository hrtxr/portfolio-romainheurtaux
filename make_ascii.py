ascii_art = r"""
  88bd88b?88,  88P  88bd8b,d88b   88bd88b 
  88P'  ` `?8bd8P'  88P'`?8P'?8b  88P' ?8b
 d88      d8P?8b,  d88  d88  88P d88   88P
d88'     d8P' `?8bd88' d88'  88bd88'   88b
""".strip('\n')

lines = ascii_art.split('\n')
max_len = max(len(l) for l in lines)
# ensure exact equal length
lines = [l.ljust(max_len) for l in lines]

# Reset to symmetric padding as the new logo might have different weight
padding_x = 10
width = max_len + (padding_x * 2)

grid_1x = []
for line in lines:
    grid_1x.append((" " * padding_x) + line + (" " * padding_x))

# Upscale 3x
upscale = 3
grid_3x = []
for row in grid_1x:
    new_row = ""
    for char in row:
        new_row += char * upscale
    for _ in range(upscale):
        grid_3x.append(new_row)

width_3x = width * upscale
top_bottom_row = f'<span class="text-[#0f0f0f]">{"#" * width_3x}</span>'

html_lines = []

# Exact 2 rows on top
for _ in range(2):
    html_lines.append(top_bottom_row)

for line in grid_3x:
    html_line = ""
    current_span = None
    current_text = ""
    for char in line:
        if char == ' ':
            span_type = 'bg'
            char_to_add = '#'
        else:
            span_type = 'fg'
            char_to_add = char
            if char_to_add == '<': char_to_add = '&lt;'
            if char_to_add == '>': char_to_add = '&gt;'
            
        if current_span != span_type:
            if current_span is not None:
                if current_span == 'bg':
                    html_line += f'<span class="text-[#0f0f0f]">{current_text}</span>'
                else:
                    html_line += f'<span class="text-[#333333]">{current_text}</span>'
            current_span = span_type
            current_text = char_to_add
        else:
            current_text += char_to_add
            
    if current_text:
        if current_span == 'bg':
            html_line += f'<span class="text-[#0f0f0f]">{current_text}</span>'
        else:
            html_line += f'<span class="text-[#333333]">{current_text}</span>'
            
    html_lines.append(html_line)

# Exact 2 rows on bottom
for _ in range(2):
    html_lines.append(top_bottom_row)

with open('ascii.html', 'w') as f:
    f.write('\n'.join(html_lines))

print(f"Max len: {max_len}")
print(f"Width 1x: {width}")
print(f"Width 3x: {width_3x}")
