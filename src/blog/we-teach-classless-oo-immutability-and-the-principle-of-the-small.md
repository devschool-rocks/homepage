---
title: We teach classless OO, immutability, and the principle of the small
author: Jim OKelly
tags: about us
publishedOn: 2016/05/08
---

There are as many languages as there are developer schools, or coding bootcamps. There are several if not a half dozen styles of programming or cultures of thinking in technology. How the hell is a new developer to know what to learn and what to leave dead in the past? Devschool is here to make that **easy** for you!

<!--more-->

## Programming Languages to learn and some to study

Learning a language means you can fluently write in. Devschool recommends those languages be JavaScript, so you can learn good, prototypical, classless, closure based programming, and Ruby, so you can learn a very friendly dialog of LISP, teaching you immensely powerful idioms and ways of solving problems dynamically.

JavaScript is the undisputed King of the Web. It is in every browser, and now through the power of Node, it is also on every computer. It has grown from an obscure, somewhat despised language to the powerhouse that it is today, overthrowing Flash, VB Script, Applets, and a number of other technologies of the past.

Ruby is just pure Joy. In fact it was developed with YOUR JOY in mind when Matz was designing it. It is wonderfully concise and readable, allowing you to get loads done with just a little code, but that little bit of code you wrote is actually readable! The true power of Ruby lies in it's parentage, and of that, it's link to LISP and SmallTalk, the two most influential languages of the coming computer age.

## What the heck is Immutability and why does it matter?

Immutability is the concept that once a value is set for a particular context, it will stay that value. It is the concept that Time is not a factor in your application. Have you ever had that experience where killing an application or even your computer and then restarting it fixes the problem?

You just encountered a State Bug, which is what happens when you change the value of variables, and those variables belong to some object container. A loop that changes the value of i every iteration is an example of state modification at it's most simple form.

### Double-Entry accounting

Modern book-keeping is actually quote old. The idea of changing a variable is double-entry is **insane**. Banks don't 'update' your account amount. Your **balance** is the mathematical calculation of the many line item debits and credits that belong to your account.

I shouldn't need to harp on that example for you to get what immutability looks like. The individual numbers, the **line items** don't change. The master calculation changes based on the addition of new records, and then those records **never change**.

## Ok, so Why All the Small things?

Large things are complex. Small things are simple. Large things that are built from small things are more simple than a large thing where there is no rational division of parts.

In UNIX, there are **philosophies** which are the commonly held principles (not dogmas as they are open to testing), of how to build a good system/software. One of those philosophies is that programs should be small, and they should do one thing well.

.... TODO
