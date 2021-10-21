from evalPlagiat import excecEvalPlagiat

import sys

code = sys.argv[1]
user_pattern = sys.argv[2]

if __name__ == '__main__':
    user_pattern = user_pattern.split(";;;")
    code = code.split(";;;")

    res = False
    for c in code:
        res = res or excecEvalPlagiat(code, user_pattern)

    print(str(res))
    sys.stdout.flush()