from getTokenizeCode import excecGetTokenizeCode

import sys

code = sys.argv[1]

if __name__ == '__main__':
    import os
    import re

    lignes = code.split("\n")
    new_lignes = []

    for ligne in lignes:   
       ligne.replace("\n","")
       new_lignes.append(ligne) 

    lignes  =  new_lignes
    res = excecGetTokenizeCode(lignes, False)

    
    print(payload)
    sys.stdout.flush()