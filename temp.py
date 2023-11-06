
with open("static\wordlist.txt", "r", encoding="UTF-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_line = line.split("	")[1]
    new_line = new_line.replace('\n', '')
    new_line = '"'+new_line+'",'
    new_lines.append(new_line)

with open("static\wordlist_new.txt", "w", encoding="UTF-8") as f:
    f.writelines(new_lines)
