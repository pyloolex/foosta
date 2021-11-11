from lollipop.errors import (
    ValidationError,
    ValidationErrorBuilder,
)

from lollipop.types import (
    Date,
    Integer,
    List,
    Object,
    String,
    Transform,
)

from lollipop.validators import (
    AnyOf,
    Length,
    Range,
    Unique,
)


class Enum(String):
    def __init__(self, choices, *args, **kwargs):
        super(Enum, self).__init__(*args, **kwargs)
        self.validators.append(AnyOf(choices))
