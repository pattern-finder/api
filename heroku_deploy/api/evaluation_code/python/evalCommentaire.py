def excecEvalCommentaire():

    filin = open("userCode.py", "r")
    lignes = filin.readlines()
    scopeCodeUser = False

    nbligne = 0
    nbligneComment = 0
    longComment = False

    for ligne in lignes:

            if ligne != "":
              nbligne += 1

            if '#' in ligne:
                nbligneComment +=1

            if '"""' in ligne:
                if ligne.count('"""') > 1:
                    nbligneComment +=1
                else:
                    if longComment:
                        longComment = False
                    else:
                        longComment = True

            if longComment:
                nbligneComment +=1



    res = ""

    if nbligne >0:
        if (nbligneComment/nbligne)*100 >= 10:
            res = "ok"
        else:
            res = "pas assez de commentaires"
    else:
        res = "ok"
    filin.close()
    return res
