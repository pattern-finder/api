# from evalNbLigneFonction import excecEvalNbLigneFonction
# from evalCommentaire import excecEvalCommentaire
# from evalRedondance import excecEvalRedondance
# from evalVariableName import excecEvalVariableName
# from evalPlagiat import excecEvalPlagiat
import sys

code = sys.argv(1)

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
    print(code)
    sys.stdout.flush()