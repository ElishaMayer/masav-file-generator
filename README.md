## The pr2oject is online at [masav-converter.com](https://masav-converter.com/)
<img alt="Big Logo" style="background:white" src="/public/LogoBig.svg" alt="drawing" width="200"/>

## About Masav Online File Generator
In Israel, Masav helps to transfer money between banks for more information - [Wikipedia](https://he.wikipedia.org/wiki/%D7%9E%D7%A8%D7%9B%D7%96_%D7%A1%D7%9C%D7%99%D7%A7%D7%94_%D7%91%D7%A0%D7%A7%D7%90%D7%99). To transfer money, it's necessary to create a transactions file with information about the transactions. The file is a binary file specified by Masav here [specifications](https://www.masav.co.il/ts_download).

## Based on the following npm packages
To create a system to handle money transfers between banks, I build the following open-source npm packages to help handle the transaction data:
- [masav](https://www.npmjs.com/package/masav) - build Masav transactions file.
- [israeli-bank-autocomplete](https://www.npmjs.com/package/israeli-bank-autocomplete) - get autocomplete results for bank branches in Israel based on information from The Bank of Isreal.
- [israeli-bank-validation](https://www.npmjs.com/package/israeli-bank-validation) - validate Israeli bank account details based on this specifications [pdf](https://www.masav.co.il/media/1982/bdikat_hukiot_heshbon_msv.pdf).
This web application uses the following packages fully offline, no data about the transactions are sent to a server. (Only general statistics are sent).

## More Info and Contact Data
For more help please contact me at [LinkedIn](https://www.linkedin.com/in/elisha-mayer-527146153/)
