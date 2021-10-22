from  getTokenizeCode import excecGetTokenizeCode

import sys

code = sys.argv[1]

if __name__ == '__main__':


    res = excecGetTokenizeCode(code, False)


    stringres = ""

    for l in res:
        if stringres != "" :
            stringres += "|separator|"

        if len(res)>0  :
            stringres += l

    stringres=stringres.replace("\\","")
    stringres=stringres.replace("\"","")

    print(stringres)
    sys.stdout.flush()