#include <vector>
#include <iostream>
#include <string>
#include <opencv2/highgui.hpp>
#include <dirent.h>
#include <sys/types.h>
#include <map>
#include "Matrice.h"
#include "Opencv.h"
#include "Exercice.h"
#include "Line.h"
#include "Pixel.h"
using namespace std;

Pixel::Pixel(int x, int y, int *color)
{
    this->x = x;
    this->y = y;
    this->color[0] = color[0];
    this->color[1] = color[1];
    this->color[2] = color[2];
}

int Pixel::getX()
{
    return this->x;
}

int Pixel::getY()
{
    return this->y;
}

int *Pixel::getColor()
{
    return this->color;
}

int Pixel::getColorRed()
{
    return this->color[0];
}

int Pixel::getColorGreen()
{
    return this->color[1];
}

int Pixel::getColorBlue()
{
    return this->color[2];
}

bool Pixel::compare(Pixel pixel2)
{

    return this->color[0] == pixel2.getColorRed() && this->color[1] == pixel2.getColorGreen() && this->color[2] == pixel2.getColorBlue();
}

Exercice::Exercice(int resultat, std::string nameExercice)
{
    this->resultat = resultat;
    this->nameExercice = nameExercice;
}

std::string Exercice::assertRes(int solution_user, int resultat)
{

    if (solution_user == resultat)
    {
        return "SUCESS";
    }
    else
    {
        return "ERROR";
    }
}

std::string Exercice::assertResMult(std::vector<double> solution_user, std::vector<double> resultat)
{

    bool equal = true;

    if (solution_user.size() == resultat.size())
    {

        for (unsigned int i = 0; i < solution_user.size(); i++)
        {
            equal = equal && solution_user[i] == resultat[i];
        }
    }
    else
    {
        return "ERROR";
    }

    if (equal)
    {
        return "SUCESS";
    }
    else
    {
        return "ERROR";
    }
}

std::string Exercice::assertResMultDict(const map<string, int> solution_user,const map<string, int> resultat){


            if(solution_user.size() != resultat.size())
                return "ERROR";

            typename map<string,int>::const_iterator i, j;
            for(i = solution_user.begin(), j = resultat.begin(); i != solution_user.end(); ++i, ++j)
            {
                if(*i != *j)
                return "ERROR";
            }

            return "SUCESS";
            }

            

std::string Exercice::assertResMultInt(std::vector<int> solution_user, std::vector<int> resultat)
{

    bool equal = true;

    if (solution_user.size() == resultat.size())
    {

        for (unsigned int i = 0; i < solution_user.size(); i++)
        {
            equal = equal && solution_user[i] == resultat[i];
        }
    }
    else
    {
        return "ERROR";
    }

    if (equal)
    {
        return "SUCESS";
    }
    else
    {
        return "ERROR";
    }
}

Line::Line()
{
}

int Line::getSize()
{
    return this->lineContent.size();
}

void Line::insertPixel(Pixel p)
{
    this->lineContent.push_back(p);
}

Pixel Line::getPixelFromLine(int x)
{
    return this->lineContent[x];
}

void Line::printEachPixelValuesOfOneLine()
{

    std::string stringLine = "";

    for (unsigned int i = 0; i < this->lineContent.size(); i++)
    {

        Pixel pixel = this->lineContent[i];

        if (pixel.getColorBlue() != 255 && pixel.getColorGreen() != 255 && pixel.getColorRed() != 255)
        {
            stringLine = stringLine + "1 ";
        }
        else
        {
            stringLine = stringLine + "0 ";
        }
    }

    std::cout << stringLine << std::endl;
}

void Line::printEachPixelsOfOneLine()
{

    std::string stringLine = "";

    for (unsigned int i = 0; i < this->lineContent.size(); i++)
    {
        Pixel pixel = this->lineContent[i];
        stringLine = stringLine + "(" + std::to_string(pixel.getColorRed()) + "," + std::to_string(pixel.getColorGreen()) + "," + std::to_string(pixel.getColorBlue()) + ")";
    }

    std::cout << stringLine << std::endl;
}

Matrice::Matrice(int size)
{
    this->size = size;
}

int Matrice::getSize()
{
    return this->size;
}

Pixel Matrice::getPixel(int x, int y)
{

    Line currentLine = this->matriceContent[y];

    Pixel pixel = currentLine.getPixelFromLine(x);
    return pixel;
}

std::vector<Line> Matrice::getMatriceContent()
{

    return this->matriceContent;
}

void Matrice::toStringPixel()
{

    for (unsigned int i = 0; i < this->matriceContent.size(); i++)
    {
        Line line = this->matriceContent[i];
        line.printEachPixelValuesOfOneLine();
    }
}

void Matrice::toStringColor()
{

    for (unsigned int i = 0; i < this->matriceContent.size(); i++)
    {
        Line line = this->matriceContent[i];
        line.printEachPixelsOfOneLine();
    }
}

void Matrice::initContent(cv::Mat img)
{

    int y = 0;

    for (y = 0; y < this->size; y++)
    {

        Line line = Line();
        int x = 0;

        for (x = 0; x < this->size; x++)
        {

            int red = img.at<cv::Vec3b>(y, x)[0];
            int green = img.at<cv::Vec3b>(y, x)[1];
            int blue = img.at<cv::Vec3b>(y, x)[2];
            ;
            int color[3] = {red, green, blue};

            Pixel pixel = Pixel(x, y, color);
            line.insertPixel(pixel);
        }

        this->matriceContent.push_back(line);
    }
}

Opencv::Opencv(std::string nameExercice)
{
    this->nameExercice = nameExercice;
}

int Opencv::getSizeImage()
{
    return this->sizeImage;
}

void Opencv::setNumberImageResultat(int nbMatriceResult)
{
    this->nbMatriceResult = nbMatriceResult;
}

void Opencv::initSizeImage()
{
    std::string image_path = cv::samples::findFile("./pictures/option1.png");
    cv::Mat img = cv::imread(image_path, cv::IMREAD_COLOR);
    this->sizeImage = img.size[0];
}

void Opencv::getNumberImage()
{

    std::string path = "./pictures/" ;
    int cptImage = 0;
    DIR *dir;
    struct dirent *ent;

    if ((dir = opendir(path.c_str())) != NULL)
    {
        cptImage = 0;
        while ((ent = readdir(dir)) != NULL)
        {

            std::string name = ent->d_name;
            std::string subStringName = name.substr(0, 6);

            if (subStringName == "option")
            {
                cptImage++;
            }
        }
        closedir(dir);
        this->numberImage = cptImage;
    }
    else
    {

        perror("");
    }
}

void Opencv::extractImage()
{
    int i = 1;

    while (i <= this->numberImage)
    {
        std::string PATH = "./pictures/option" + std::to_string(i) + ".png";
        std::string image_path = cv::samples::findFile(PATH);
        cv::Mat img = cv::imread(image_path);
        this->listPatternInit.push_back(img);
        i++;
    }
}

Matrice Opencv::matriceResult()
{

    std::string image_path = cv::samples::findFile("./pictures/result.png");
    cv::Mat img = cv::imread(image_path);
    Matrice matriceResult = Matrice(this->sizeImage);
    matriceResult.initContent(img);
    return matriceResult;
}

std::vector<Matrice> Opencv::initExercice()
{
    std::vector<Matrice> listPattern;

    for (unsigned int i = 0; i < this->listPatternInit.size(); i++)
    {
        cv::Mat mat = this->listPatternInit[i];
        Matrice matrice = Matrice(this->sizeImage);
        matrice.initContent(mat);
        listPattern.push_back(matrice);
    }

    return listPattern;
}
