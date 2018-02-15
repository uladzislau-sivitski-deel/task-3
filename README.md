Задание «Игра в города»
Напишите игру, в которой человек и компьютер по очереди называют города таким образом, чтобы название следующего города начиналось на последнюю букву предыдущего. Игра продолжается до тех пор, пока у одного из участников не закончатся варианты. Более подробные правила можно найти в Википедии.

Игра должна представлять собой веб-страницу с полем, в которое вводится название города — с клавиатуры или голосом. Для голосового ввода можно использовать, например, Web Speech API. Названия городов можно сохранить заранее, запросить полным списком до начала игры или получать по одному в ходе игры. В комментариях к коду поясните, почему вы выбрали тот или иной способ.

Названные города нужно отмечать на карте: координаты можно получить с помощью прямого геокодирования (пример). Города не должны повторяться. В случае повтора должно появиться сообщение об этом. После завершения игры нужно показать списки городов, введённых человеком и компьютером, и подвести итог.



Данные о городах я решил получить из Википедии.
Скопировав всю категорию Населенные пункты по алфавиту я получил базу из ~200000 населенных пунктов.
Всю эту базу я затем прогнал через геолокацию Яндекс чтобы исключить населенные пукты, которых в базе Яндекс нет. Т.к. вероятность ошибки осталась из-за того, что запросы иногда падали и есть погрешность, город проверяется на наличие в базе после валидации по основным признакам.