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

    test  = []
    for c in code:
        c = c.replace("\n", "")
        c = c.replace("\\", "")
        test.append(c)
        res = excecEvalPlagiat(c, tab_pattern)

    print(str(tab_pattern) +" "+ str(test) +" "+str(res))
    sys.stdout.flush()