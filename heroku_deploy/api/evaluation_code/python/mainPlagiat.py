from evalPlagiat import excecEvalPlagiat

import sys

code = sys.argv[1]
user_pattern = sys.argv[2]

if __name__ == '__main__':
    user_pattern = user_pattern.split(";;;")
    code = code.split(";;;")

    res = False
    test = []
    for c in code:
        c = c.replace("\n", "")
        res = excecEvalPlagiat(c, user_pattern)
        test.append(c)

    print(str(user_pattern) +"\n"+ str(test) +"\n"+str(res))
    sys.stdout.flush()