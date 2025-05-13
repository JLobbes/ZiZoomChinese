
Description: 

    A photo viewer with the ability to turn sections of the photo into flash cards. Intended for studying Chinese.


ERD:

![ERD for the Lugnuts DB](/images/ZiZoomChinese_ERD.png)

UML:

```

    @startuml

    skinparam tabSize 10
    !define not_null(x) <u>x</u>
    !define primary_key(x) <b>PK\t not_null(x)</b>
    !define foreign_key(x) <b>FK\t x</b>
    !define foreign_and_primary_key(x) <b>PK, FK\t not_null(x)</b>
    !define attribute(x) \t x

    '------------------------------
    ' Entities
    '------------------------------

    entity DECKS {
        primary_key(DECK_ID)
        ----
        attribute(DECK_NAME)
        foreign_key(PARENT_DECK_ID)  ' Self-referencing for nested folders
    }

    entity FLASHCARDS {
        primary_key(FLASHCARD_ID)
        ----
        foreign_key(DECK_ID)
        attribute(FLASHCARD_ENG)
        attribute(FLASHCARD_CHN)
        attribute(FLASHCARD_PINYIN)
        attribute(FLASHCARD_SOURCE_IMG_PATH)
        attribute(FLASHCARD_CROP_X)
        attribute(FLASHCARD_CROP_Y)
        attribute(FLASHCARD_CROP_WIDTH)
        attribute(FLASHCARD_CROP_HEIGHT)
        ----
        attribute(FLASHCARD_LAST_REVIEWED)
        attribute(FLASHCARD_NEXT_REVIEW)
        attribute(FLASHCARD_REVIEW_COUNT)
        attribute(FLASHCARD_INCORRECT_COUNT)
        attribute(FLASHCARD_EASE_FACTOR)
    }

    '------------------------------
    ' Relationships
    '------------------------------

    DECKS ||--o{ FLASHCARDS : "contains"
    DECKS ||--o{ DECKS : "has sub-decks"

    @enduml

```

Starter Code for DB:

``` 

-- Create DECKS table
CREATE TABLE DECKS (
    DECK_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    DECK_NAME VARCHAR(255),
    PARENT_DECK_ID INT,
    FOREIGN KEY (PARENT_DECK_ID) REFERENCES DECKS(DECK_ID)
);

-- Create FLASHCARDS table
CREATE TABLE FLASHCARDS (
    FLASHCARD_ID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    DECK_ID INT,
    FLASHCARD_ENG VARCHAR(255),
    FLASHCARD_CHN VARCHAR(255),
    FLASHCARD_PINYIN VARCHAR(255),
    FLASHCARD_SOURCE_IMG_PATH VARCHAR(512),
    FLASHCARD_CROP_X VARCHAR(255),
    FLASHCARD_CROP_Y VARCHAR(255),
    FLASHCARD_CROP_WIDTH VARCHAR(255),
    FLASHCARD_CROP_HEIGHT VARCHAR(255),
    FLASHCARD_LAST_REVIEWED DATE,
    FLASHCARD_NEXT_REVIEW DATE,
    FLASHCARD_REVIEW_COUNT INT,
    FLASHCARD_INCORRECT_COUNT INT,
    FLASHCARD_EASE_FACTOR FLOAT,
    FOREIGN KEY (DECK_ID) REFERENCES DECKS(DECK_ID)
);

```

