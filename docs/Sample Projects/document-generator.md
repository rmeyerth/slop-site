---
sidebar_position: 4
---

# Document Generator (TBD)
Using Apache POI and template document that contain SLOP expressions, it would have the following features: 
- Tables can be generated from a Collection (context object or referenced field)
- Conditionals can be used to add / omit sections or watermarks
- When a template file is uploaded, the document can be run through the lexer and the output saved to file. This can
then be loaded to improve performance on multi-document creation.
- Template files would be stored in *.docx format and output to the same or PDF