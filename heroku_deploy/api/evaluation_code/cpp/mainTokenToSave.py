from getTokenizeCode import excecGetTokenizeCode

import sys

code = sys.argv[1]

if __name__ == '__main__':


    res = excecGetTokenizeCode(code, True)
            
    res=res.replace("\\","")
    res = res.replace("\n", "")
    res=res.replace("\"","")
    print(res)
    sys.stdout.flush()