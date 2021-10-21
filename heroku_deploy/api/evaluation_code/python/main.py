from evaluation_code.evalNbLigneFonction import excecEvalNbLigneFonction
from evaluation_code.evalCommentaire import excecEvalCommentaire
from evaluation_code.evalRedondance import excecEvalRedondance
from evaluation_code.evalVariableName import excecEvalVariableName
from evaluation_code.evalPlagiat import excecEvalPlagiat

if __name__ == '__main__':
    import os
    import re
    filin = open("userCode.py","r")
    lignes = filin.readlines()
    new_lignes = []

    for ligne in lignes:   
       ligne.replace("\n","")
       new_lignes.append(ligne) 

    lignes  =  new_lignes
    payload = {
        "eval_variable_name":excecEvalVariableName(lignes),
        "eval_redondance": excecEvalRedondance(lignes),
        "eval_nb ligne_fonction": excecEvalNbLigneFonction(lignes),
        "eval_commentaire": excecEvalCommentaire(lignes),
        "eval_plagiat": excecEvalPlagiat(lignes)
    }
    filin.close()
    print(payload)