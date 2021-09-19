#ifndef DEF_EXERCICE // include guard
#define  DEF_EXERCICE 
#include <map>
using namespace std;

class Exercice{

        public :
        
        int resultat;
        std::string nameExercice;

        Exercice(int resultat, std::string nameExercice);
        std::string assertRes(int solution_user, int resultat);
        std::string assertResMult(std::vector<double> solution_user, std::vector<double> resultat);
        std::string assertResMultInt(std::vector<int> solution_user, std::vector<int> resultat);
        std::string assertResMultDict(const std::map<string, int>  solution_user, const std::map<string, int> resultat);

    };

#endif /* MY_CLASS_H */