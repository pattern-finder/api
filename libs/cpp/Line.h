#ifndef LINE_H // include guard
#define LINE_H

#include "Pixel.h"
#include <vector>

class Line
{

public:
    std::vector<Pixel> lineContent;

    int size;

    Line();

    Line(int size);

    void insertPixel(Pixel p);

    int getSize();

    Pixel getPixelFromLine(int x);

    void printEachPixelValuesOfOneLine();

    void printEachPixelsOfOneLine();
};

#endif /* MY_CLASS_H */
