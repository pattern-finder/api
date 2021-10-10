from evaluation_code.evalNbLigneFonctionCpp import excecEvalNbLigneFonction
from evaluation_code.evalCommentaireCpp import excecEvalCommentaire
from evaluation_code.evalRedondanceCpp import excecEvalRedondance
from evaluation_code.evalVariableNameCpp import excecEvalVariableName

if __name__ == '__main__':
    payload = {
        "eval_variable_name\":excecEvalVariableName(),
        "eval_redondance\": excecEvalRedondance(),
        "eval_nb ligne_fonction\": excecEvalNbLigneFonction(),
        "eval_commentaire\": excecEvalCommentaire()
    }
    print(payload)