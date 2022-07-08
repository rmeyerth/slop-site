---
hide_table_of_contents: true
---

# Asking the question...
![But why?](/img/why.gif)

If you've read through the Quick Start section or are a newcomer to expression languages, you may be asking yourself 
that question. Looking around for an answer on the web is not that easy. There are well established expression languages (EL) 
out there including [Jexl](https://commons.apache.org/proper/commons-jexl/) and [SpeL](https://docs.spring.io/spring-integration/docs/5.3.0.RELEASE/reference/html/spel.html), but most sites seem to dive into how to use them rather than 
explain why you'd actually want to do so. They mention something about dynamic configuration / scripting and then move on. 
As such, complaints like these usually follow:
1. No IDE support to help write it
2. No perceived type safety
3. Why use it when you can just write native code?

Some of these like the lack of IDE support are genuine, but that's not to say it won't happen. The advantage with IDE's like
[IntelliJ](https://www.jetbrains.com/idea/) is that plugins can be written to provide that support. The main issue as 
with most things is finding the time to do it. It is on the roadmap and depending on how the initial release goes, it will 
be prioritised accordingly.

As for type safety, SLOP adheres to the same ruleset as the underlying language (Java). When values are read from an expression 
they are assigned to an typed literal token class. If a value is defined as one type but is not in the expected format, an error 
is thrown. Likewise type operations (whilst configurable) must also adhere to the specified types that are compatible or be 
rejected by the Parser. (see [Type Operations](/docs/Extending/type-operations) for more information). 

On the last point, why would you choose this over writing actual code? Typically when writing back-end API's or applications, 
you add functionality to handle the predicted use model. For example, take a bank where customers accounts are being managed. You 
can write code to handle common things like payments, transfers, account information etc. All of these are well defined but 
what about something a bit more open-ended like notifications? Say for example the customer wants to be informed when their account 
goes below a certain threshold. Most banks can support this, but what happens when a customer wants to be notified if they have 
less than 250 in the bank prior to the 11th of every month when they pay their energy bill? A system can be written to handle 
most scenarios, but as coverage increases so too does the complexity.

This is where expression languages come in so that you don't have to try and predict what to handle. Code can be written on-the-fly 
to handle any scenario that arises if provided the necessary context and can run instantly. Keep in mind that this is just one example, 
but by opening up your system to dynamic configuration you could start to remove the shackles of constant code deployments / hotfixes.