from evalPlagiat import excecEvalPlagiat

import sys

code = sys.argv[1]
user_pattern = sys.argv[2]

if __name__ == '__main__':
    user_pattern = user_pattern.split(";;;")
    code = code.split(";;;")

    res = False
    for c in code:
        res = excecEvalPlagiat(c, user_pattern)

    print(res)
    sys.stdout.flush()