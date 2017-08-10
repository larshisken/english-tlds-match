/**
 * @Author: Lars Hisken <lars>
 * @Date:   2017-08-10T09:50:53+02:00
 * @Last modified by:   lars
 * @Last modified time: 2017-08-10T10:55:04+02:00
 */

const fs = require('fs-extra');

(() => {

    const words = fs.readFileSync('./words.txt').toString().split('\n').map(val => val.toLowerCase());
    const tlds = fs.readFileSync('./tlds.txt').toString().split('\n').filter(val => val.length !== 0);

    /**
     * A DomainNode contains domain information about a word
     * @type    {DomainNode}
     */
    class DomainNode {
        constructor(fullWord, extensions) {
            this.fullWord = fullWord;
            this.extensions = extensions;
            this.possibilities = this.extensions.map(this.mapPossibilities(this.fullWord));
        }
        /**
         * Map all possible domain names
         * @param     {string}    fullWord
         * @return    {function}
         */
        mapPossibilities (fullWord) {
            return extension => `${fullWord.slice(0, fullWord.length - extension.length)}.${fullWord.slice(fullWord.length - extension.length)}`;
        }
    }

    /**
     * Check if a word contains a certain end
     * @param     {string}    text
     * @return    {function}
     */
    const endIn = text => end => text.endsWith(end);

    /**
     * Check whether a word contains one of multiple endings
     * @param     {array}    endings
     * @return    {function}
     */
    const containsEnd = endings => text => endings.filter(endIn(text)).length !== 0;

    /**
     * Map words with endings to a DomainNode
     * @param     {array}       endings
     * @return    {DomainNode}
     */
    const mapEnd = endings => text => new DomainNode(text, endings.filter(endIn(text)));

    // Usage
    const domainNodes = words.filter(containsEnd(tlds)).map(mapEnd(tlds));

    // Remove old file
    fs.removeSync('./domain-nodes.json');

    // Output new file
    fs.outputJsonSync('./domain-nodes.json', domainNodes, { spaces: 2 });

})(fs);
