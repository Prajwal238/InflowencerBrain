import openai
def generate_rag_doc(influencer: dict):
    # name = influencer.get("name")
    location = influencer.get("location", "")
    # bio = influencer.get("bio", "")
    categories = ", ".join(influencer.get("categories", []))
    languages = ", ".join(influencer.get("languages", []))
    rating = influencer.get("rating", 0)

    # platform_chunks = []
    # for p in influencer.get("platforms", []):
    #     platform_chunks.append(
    #         f"{p['name'].capitalize()} handle: {p['handle']} with {p['followers']} followers and {p['engagementRate']}% engagement rate. "
    #         f"Past collaborations: {', '.join(p.get('pastCollaborations', []))}."
    #     )

    # platforms_text = '\n'.join(platform_chunks)

    prompt = (
            f"Summarize the following influencer profile in a short, descriptive paragraph for search and retrieval:\n"
            f"{influencer}"
        )

    # Call OpenAI API to generate the paragraph
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert assistant specializing in writing concise and informative summaries of influencer profiles. Your summaries should capture the key details and unique qualities of each influencer, making them easy to search and retrieve from a database"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=120,
        temperature=0.7,
    )
    generated_paragraph = response['choices'][0]['message']['content'].strip()

    text = generated_paragraph
    # text = (
    #     f"{name} is a {categories} influencer based in {location}. and has a rating of {rating}."
    #     f"Speaks: {languages}.\n\n"
    #     f"{platforms_text}\n\nBio: {bio}"
    #     )
    print("======================================")
    print(text)
    metadata = {
        "influencerId": influencer["_id"],
        "location": location.lower(),
        "categories": categories,
        "languages": languages,
        "rating": rating
    }

    print(metadata)
    return text, metadata
