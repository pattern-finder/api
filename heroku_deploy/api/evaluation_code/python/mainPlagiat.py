from evalPlagiat import excecEvalPlagiat

import sys

code = sys.argv[1]
user_pattern = sys.argv[2]

if __name__ == '__main__':
    user_pattern = user_pattern.split(";;;")
    res = excecEvalPlagiat(code, user_pattern)

    print("responce plagiat"+str(user_pattern)+ "   "+ str(code))
    sys.stdout.flush()