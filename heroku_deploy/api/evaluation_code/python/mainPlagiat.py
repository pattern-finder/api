from evalPlagiat import excecEvalPlagiat

import sys

code = sys.argv[1]
user_pattern = sys.argv[2]

if __name__ == '__main__':

    res = excecEvalPlagiat(code, user_pattern)

    print(res)
    sys.stdout.flush()