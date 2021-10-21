import re



def calculate_correspondance_list(text, pattern_user):
    i = 0
    j = 0

    cpt_correspondance = 0
    cpt_non_correspondance = 0
    stop = False
    print("text[i]")

    while i < len(text) and not stop:
        print(text[i])
        print(pattern_user[j])
        print(cpt_correspondance)

        print("")

        if j < len(pattern_user):
            if text[i] == pattern_user[j]:
                cpt_correspondance += 1
                j +=1

            else:
                print("NON")
                cpt_non_correspondance += 1
        else:
            stop = True
            print("Stop")
        i += 1

    res =  cpt_correspondance - cpt_non_correspondance
    print(res)
    if res < 0:
        return 0
    else:
        return res

def calculate_plagiarism_rate(hash_table):
        th_a = len(hash_table["a"])
        th_b = len(hash_table["b"])
        a = hash_table["a"]
        b = hash_table["b"]
        sh = calculate_correspondance_list(a,b)

        if th_b > th_a:
            th_b = th_a

        p = (float(2 * sh) / (th_a + th_b)) * 100
        return p


def rec_calculate_h(i,h,q,d, limit):
    if i < limit:
        h = (h * d) % q
        i += 1
        return rec_calculate_h(i,h,q,d, limit)
    else:
        return h


def rec_init_hash(i,h,q,d, limit):
    if i < limit:
        h = (h * d) % q
        i += 1
        return rec_init_hash(i,h,q,d, limit)
    else:
        return h

def rec_calculate_hash(i,hash_user_pattern,hash_code, pattern, code, q,d, limit):
    if i < limit:
        hash_user_pattern = (d * hash_user_pattern + ord(pattern[i])) % q
        hash_code = (d * hash_code + ord(code[i])) % q
        i += 1
        return rec_calculate_hash(i, hash_user_pattern, hash_code, pattern, code, q, d, limit)
    else:
        return (hash_user_pattern, hash_code)



def rec_findpattern(res, i, size_code, size_pattern, hash_code, hash_user_pattern, code, pattern, h, d, limit, q):

    if i < limit:

        if hash_user_pattern == hash_code:
            j = 0
            while j < size_pattern:
                if code[i + j] != pattern[j]:
                    break
                else:
                    j += 1
                j += 1

            if j == size_pattern:
                res.append("Pattern found at index " + str(i))

        if i < size_code - size_pattern:
            hash_code = (d * (hash_code - ord(code[i]) * h) + ord(code[i + size_pattern])) % q

            if hash_code < 0:
                hash_code = hash_code + q
        i += 1
        return rec_findpattern(res, i, size_code, size_pattern, hash_code, hash_user_pattern, code, pattern, h, d, limit, q)

    else:
        return res


def search(pattern, code, q):
        size_pattern = len(pattern)
        size_code = len(code)
        hash_user_pattern = 0
        hash_code = 0
        h = 1
        d = 256

        i=0

        limit = size_pattern - 1
        h = rec_init_hash(i,h,q,d, limit)

        limit = size_pattern
        hash_code = rec_calculate_hash(i, hash_user_pattern, hash_code, pattern, code, q, d, limit)
        hash_user_pattern = hash_code[0]
        hash_code = hash_code[1]


        limit = size_code - size_pattern + 1
        res = []
        res = rec_findpattern(res, i, size_code, size_pattern, hash_code, hash_user_pattern, code, pattern, h, d, limit, q)
        return len(res) > 0


def excecEvalPlagiat(code, user_pattern):

    q = 101
    result = False

    for pattern in user_pattern:

        if len(pattern) <= len(code):
            result = result or search(pattern, code, q)

    return 