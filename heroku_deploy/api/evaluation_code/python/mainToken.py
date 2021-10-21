from getTokenizeCode import excecGetTokenizeCode

import sys

code = sys.argv[1]

if __name__ == '__main__':


    res = excecGetTokenizeCode(code, False)

    
    print(res)
    sys.stdout.flush()