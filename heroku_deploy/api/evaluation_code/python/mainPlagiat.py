from evalPlagiat import excecEvalPlagiat

import sys

code = sys.argv[1]
user_pattern = sys.argv[2]

if __name__ == '__main__':
    user_pattern = user_pattern.split(";;;")
    code = code.split(";;;")

    res = False
    for c in code:
        c = c.replace("\n", "")
        res = excecEvalPlagiat(c, user_pattern)

    print(user_pattern +"\n"+ code +"\n"+res)
    sys.stdout.flush()