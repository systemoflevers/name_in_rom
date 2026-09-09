// Based the GBDK-2020 minimal GB template example with very minor changes.
// https://github.com/gbdk-2020/gbdk-2020/tree/ae2a595f465fab759bfd4afab97d4d581605a3b0/gbdk-lib/examples/gb/template_minimal

#include <gb/gb.h>
#include <stdint.h>
#include <stdio.h>

const unsigned char myString[] = "12345678901234567890";
void main(void)
{
    printf("\n\n\n\n\n        HI!\n\n\n");
    printf(myString);
    printf("\n\n\n    you're cool!");

    // Loop forever
    while(1) {

		// Game main loop processing goes here

		// Done processing, yield CPU and wait for start of next frame
        vsync();
    }
}
