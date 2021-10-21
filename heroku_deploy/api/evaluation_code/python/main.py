# from evalNbLigneFonction import excecEvalNbLigneFonction
# from evalCommentaire import excecEvalCommentaire
# from evalRedondance import excecEvalRedondance
# from evalVariableName import excecEvalVariableName
# from evalPlagiat import excecEvalPlagiat
import sys

code1 = sys.argv(0)
code2 = sys.argv(1)
code3 = sys.argv(2)

if __name__ == '__main__':
    # import os
    # import re

    # lignes = code.split("\n")
    # new_lignes = []

    # for ligne in lignes:   
    #    ligne.replace("\n","")
    #    new_lignes.append(ligne) 

    # lignes  =  new_lignes
    # payload = {
    #     "eval_variable_name":excecEvalVariableName(lignes),
    #     "eval_redondance": excecEvalRedondance(lignes),
    #     "eval_nb ligne_fonction": excecEvalNbLigneFonction(lignes),
    #     "eval_commentaire": excecEvalCommentaire(lignes),
    #     "eval_plagiat": excecEvalPlagiat(lignes)
    # }
    print("test :"+str(code1) + str(code2)+ str(code3))
    sys.stdout.flush()