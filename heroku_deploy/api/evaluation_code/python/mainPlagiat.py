from evalPlagiat import excecEvalPlagiat

import sys

code = sys.argv[1]
user_pattern = sys.argv[2]

if __name__ == '__main__':
    user_pattern = user_pattern.split("|separator|")
    code = code.split("|separator|")

    res = None

    tab_pattern = []


    for p in user_pattern:
        p = p.replace("\n", "")
        p = p.replace("\\", "")
        tab_pattern.append(p)

    for c in code:
        c = c.replace("\n", "")
        c = c.replace("\\", "")

        res = excecEvalPlagiat(c, tab_pattern)

    print(str(tab_pattern) +" "+ str(code) +" "+str(res))
    sys.stdout.flush()