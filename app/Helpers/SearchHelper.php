<?php

namespace App\Helpers;

class SearchHelper
{
    /**
     * Transliterate Cyrillic to Latin
     */
    public static function transliterate($text)
    {
        $cyr = [
            'а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п',
            'р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я',
            'А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П',
            'Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я'
        ];
        $lat = [
            'a','b','v','g','d','e','io','zh','z','i','y','k','l','m','n','o','p',
            'r','s','t','u','f','h','ts','ch','sh','shch','','y','','e','yu','ya',
            'A','B','V','G','D','E','Io','Zh','Z','I','Y','K','L','M','N','O','P',
            'R','S','T','U','F','H','Ts','Ch','Sh','Shch','','Y','','E','Yu','Ya'
        ];
        return str_replace($cyr, $lat, $text);
    }

    /**
     * Convert keyboard layout (RU <-> EN)
     */
    public static function convertLayout($text)
    {
        $en = [
            'q','w','e','r','t','y','u','i','o','p','[',']','a','s','d','f','g','h','j','k','l',';','\'','z','x','c','v','b','n','m',',','.','/'
        ];
        $ru = [
            'й','ц','у','к','е','н','г','ш','щ','з','х','ъ','ф','ы','в','а','п','р','о','л','д','ж','э','я','ч','с','м','и','т','ь','б','ю','.'
        ];

        // If text has Cyrillic, convert to Latin
        if (preg_match('/[а-яА-ЯёЁ]/u', $text)) {
            return str_replace($ru, $en, mb_strtolower($text));
        }

        // Otherwise convert to Cyrillic
        return str_replace($en, $ru, mb_strtolower($text));
    }

    /**
     * Transliterate Latin to Cyrillic (simple mapping for searching)
     */
    public static function transliterateToCyrillic($text)
    {
        $lat = [
            'shch','sh','ch','zh','yo','yu','ya','ts','kh',
            'a','b','v','g','d','e','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h'
        ];
        $cyr = [
            'щ','ш','ч','ж','ё','ю','я','ц','х',
            'а','б','в','г','д','е','з','и','ы','к','л','м','н','о','п','р','с','т','у','ф','х'
        ];
        return str_ireplace($lat, $cyr, $text);
    }
}
