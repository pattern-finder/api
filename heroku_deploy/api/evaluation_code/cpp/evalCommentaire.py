def excecEvalCommentaire(filin):

    lignes = filin.readlines()
    scopeCodeUser = False

    nbLigne = 0
    nbComment = 0
    longComment = False

    for ligne in lignes:


            if ligne != "":
                nbLigne += 1

            if '//' in ligne and not longComment:
                nbComment +=1

            if '/*' in ligne:
                longComment = True

            if '*/' in ligne:
                longComment = False

            if longComment:
                nbComment += 1


    res = ""
    if nbLigne >0:

        if (nbComment/nbLigne)*100 >= 10:
            res = "ok"
        else:
            res = "error"
    else:
        res = "ok"

    return res
