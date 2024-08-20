quotes = {
    'context': {'attrib': '<span class="quote-author">Alicia Juarrero</span>, <em>Context Changes Everything</em>','text': 'Contextual constraints integrate and organise all matter of energy, matter, and information flow. Constraints generate new coherent design patterns in the inanimate world as well as in living things---to wit, atmospheric dynamics, convection cells, and laser beams.'},
    'history': {'attrib': '<span class="quote-author">Karl Marx</span>, <em>The Eighteenth Brumaire of Louis Bonaparte</em>', 'text': 'Men make their own history, but they do not make it just as they please; they do not make it under circumstances chosen by themselves, but under circumstances directly encountered, given and transmitted from the past. The tradition of all the dead generations weights like a nightmare on the brain of the living.'},
    'science': {'attrib': '<span class="quote-author">Chris Haufe</span>, <em>Do the Humanities Create Knowledge?</em>', 'text': 'Scientific knowledge is not the conclusion one draws from his properly carried-out scientific methodology. It is a social sausage-making process, during which groups of similarly inclined but often antagonistic scientific charcutiers select the finest cuts from the world\'s prize-winning pigs, applying a prescription strength dewormer befoe surgically slicing them into bits and packing them in the highly elastic but appropriately constrictive intestinal casing of publication, so they can be smoothly digested by members of the community. This social dimension is what distinguishes the idea of a single person from the knowledge of a community.'},
    'commons': {'attrib': '<span class="quote-author">Anna Tsing</span>, <em>The Mushroom at the End of the World</em>', 'text': 'The thrill of private ownership is the fruit of an underground common.'},
    'chaos': {'attrib': '<span class="quote-author">Edward Lorenz</span>, <em>The Essence of Chaos</em>', 'text': 'The phenomenon that a small alteration in the state of a dynamical system will cause subsequent states to differ greatly from the states that would have followed without the alteration.'},
    'complex': {'attrib': '<span class="quote-author">Jane Jacobs</span> (As quoted in James C. Scott, <em>Seeing Like a State</em>)', 'text': 'To see complex systems of functional order as order, and not as chaos, takes understanding. The leaves dropping from the trees in the autumn, the interior of an airplane engine, the entrails of a rabbit, the city desk of a newspaper, all appear to be chaos if they are seen without comprehension. Once they are seen as systems of order, they actually look different.'},
    'competition': {'attrib': '<span class="quote-author">Kim Moody</span>, "Why it\'s high time to move on from \'Just in Time\' supple chains"', 'text': 'Competition makes resilience itself risky for individual companies. [...] Yet so long as profitability is the driving force, national efforts to turn inward or "take back control"---ironically, in order to create an imagined resilience, as with Brexit---simply create more disruptions, broken supply chains and higher prices as businesses seek to recover losses. The regime of cheap consumer goods becomes more and more difficult to sustain.'},
    'nature': {'attrib': '<span class="quote-author">Timothy Morton</span>, <em>Hyperobjects</em>', 'text': 'What is the upgrading process? In a word, the notion that we are living "in" a world--one that we call Nature---no longer applies in any meaningful sense, except as nostalgia or in the temporarily useful local langauge of pleas or petitions. [...] Global Warming has performed a radical shift in the status of the weather. Why? Because <em>the world</em> as such---not just a specfic idea of the world but <em>world</em> in its entirety---has evaporated. Or rather, we are realizing that we never had it in the first place.'},
    'nexus': {'attrib': '<span class="quote-author">Frank Herbert</span>, <em>Dune</em>', 'text': 'The guild hinted that its navigators, who used the spice drug on Arrakis to produce the limited prescience necessary for guiding spaceships through the void, were "bothered by the future" or "saw problems on the horizon". This could only mean they saw a nexus, a meeting place of countless delicate decisions, beyond which the path was hidden from the prescient eye. This was a clear indication that some agency was interfering with higher order dimensions!'}
}

connections = {
    'context': ['history'],
    'history': ['commons'],
    'science': ['commons', 'nexus'],
    'commons': ['competition', 'history', 'science'],
    'chaos': ['complex', 'competition'],
    'complex': ['nature'],
    'competition': ['nature', 'complex', 'chaos'],
    'nature': ['context'],
    'nexus': ['chaos']
}

function usrchoice(question, answers, target='#game-log-window'){
    let q = document.createElement('div')
    q.innerHTML = question
    q.classList.add('next-question-div')
    document.querySelector(target).appendChild(q)
    // document.querySelector(target).appendChild(document.createElement('br'))
    answers.forEach(element => {
        var new_button = document.createElement("button");
        new_button.innerHTML = element
        new_button.classList.add('active-game-button')
        new_button.id = element
        document.querySelector(target).appendChild(new_button)
    });
    // document.querySelector('#quote-box').scrollTop = document.querySelector('#quote-box').scrollHeight;

    return new Promise((resolve)=>{
        document.querySelectorAll('.active-game-button').forEach((item) => {item.onclick = (e)=>{
            document.querySelectorAll('.active-game-button').forEach((item) => {item.classList.add('disabled-game-button')})
            document.querySelectorAll('.active-game-button').forEach((item) => {item.classList.remove('active-game-button')})
            resolve(e.target.id);
            }
        })
    })

}

async function wait(delay=1000){
    return new Promise((inner)=>{
        setTimeout(inner, delay);
    })
}
async function create_quote(reference){
    let q = quotes[reference];
    let new_quote = document.createElement('div')
    let text_content = q['text'].replace('---', '—')
    new_quote.classList.add('quote')
    let new_quote_text = document.createElement('div')
    new_quote_text.classList.add('quote-text')
    let first_text = text_content.split(' ').splice(0, 3).join(' ')
    let rest_text = text_content.split(' ')
    rest_text.splice(0, 3)
    rest_text = rest_text.join(' ')
    new_quote_text.innerHTML = '<span class="small-caps">'+first_text+'</span> '+rest_text
    let new_quote_attrib = document.createElement('div')
    new_quote_attrib.classList.add('quote-attrib')
    new_quote_attrib.innerHTML = q['attrib']

    new_quote.appendChild(new_quote_text)
    new_quote.appendChild(new_quote_attrib)
    let qbox = document.querySelector('#quote-box')
    qbox.appendChild(new_quote)

    let next_box = document.createElement('div')
    next_box.id = 'next-question-box'
    qbox.appendChild(next_box)

    let next_quote = await usrchoice('Think about...', connections[reference], '#next-question-box')
    document.querySelector('#next-question-box').style.opacity = '0%'
    await wait(350)
    // qbox.removeChild(next_box)
    // qbox.appendChild(document.createElement('br'))
    qbox.innerHTML = ''

    create_quote(next_quote)
}

