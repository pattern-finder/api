
from evalNbLigneFonctionPy import excecEvalNbLigneFonctionPy
from evalCommentairePy import excecEvalCommentaire
from evalRedondancePy import excecEvalRedondance
from evalVariableNamePython import excecEvalVariableNamePython



if __name__ == '__main__':
    code="def excecEvalRedondance(code)" \
         "  Aa = 0" \
         "def excecEvalRedondance(code)" \
         "  Aa = 0"

    payload = {
        "eval variable name":excecEvalVariableNamePython(code),
        "eval redondance": excecEvalRedondance(code),
        "eval nb ligne fonction": excecEvalNbLigneFonctionPy(code),
        "eval commentaire": excecEvalCommentaire(code)
    }

    print(payload)



