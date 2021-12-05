# Disabling pylint here because this module is supposed to contain all
# the lollipop-related stuff for the subsequent reimporting.
# pylint: disable=unused-import

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
        super().__init__(*args, **kwargs)
        self.validators.append(AnyOf(choices))
